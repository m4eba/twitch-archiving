import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { execFfmpeg, initLogger } from '@twitch-archiving/utils';
import { task as t, getRecPrismaClient } from '@twitch-archiving/database';
import {
  PlaylistMessage,
  PlaylistMessageType,
  ScreenshotRequestMessage,
  SegmentDownloadedMessage,
  StoryboardData,
  StoryboardFileData,
  StoryboardRequestMessage,
} from '@twitch-archiving/messages';
import { randomUUID } from 'crypto';

export interface ServiceConfig {
  inputTopic: string;
  screenshotTopic: string;
  user: string[];
  name: string;
  interval: number;
  rows: number;
  columns: number;
  width: number;
}

export const ServiceConfigOpt: ArgumentConfig<ServiceConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-playlist' },
  screenshotTopic: { type: String, defaultValue: 'tw-screenshot' },
  user: { type: String, multiple: true },
  interval: { type: Number, defaultValue: 10.0 },
  rows: { type: Number },
  columns: { type: Number },
  width: { type: Number },
  name: { type: String },
};

const logger: Logger = initLogger('playlist-storyboard-lib');
const client = getRecPrismaClient();

export async function processMessage(
  config: ServiceConfig,
  producer: Producer,
  playMsg: PlaylistMessage
): Promise<void> {
  const recordingId = BigInt(playMsg.recordingId);

  const board = await client.storyboard.findFirst({
    where: {
      recordingId,
      name: config.name,
    },
    orderBy: {
      id: 'desc',
    },
  });

  if (playMsg.type === PlaylistMessageType.START) {
    // do noting if board already exists
    if (board) {
      logger.debug({ board }, 'storyboard already exist');
      return;
    }
    const data: StoryboardData = {
      currentIdx: 0,
      currentOffset: 0,
      lastSegmentSeq: -1,
      lastScreenshotIndex: -1,
    };
    const storyboard = await client.storyboard.create({
      data: {
        recordingId,
        name: config.name,
        columns: config.columns,
        rows: config.rows,
        interval: config.interval,
        width: config.width,
        height: 0,
        data: data as any,
        modified: new Date(),
      },
    });
    logger.trace({ storyboard }, 'init storyboard');
    const fileData: StoryboardFileData = {
      screenshots: [],
    };
    const file = await client.storyboardFile.create({
      data: {
        storyboardId: storyboard.id,
        firstSequence: 0,
        firstScreenshot: 0,
        index: 0,
        length: 0,
        timeOffset: 0,
        slug: randomUUID().replaceAll(/\-/g, ''),
        data: fileData as any,
      },
    });
    logger.trace({ file }, 'first file');
    return;
  }

  // need the board from here on
  if (!board) {
    throw new Error('storyboard not initialized');
  }

  const boardData = board.data as StoryboardData | null;
  if (boardData === null) {
    throw new Error('storyboard data is null');
  }

  let file = await client.storyboardFile.findFirst({
    where: {
      storyboardId: board.id,
      index: boardData.currentIdx,
    },
  });

  if (!file) {
    throw new Error('storyboard file not found');
  }
  if (!file.data) {
    throw new Error('file data is empty');
  }

  const fileData: StoryboardFileData = file.data as any;

  // send storyboard request for last
  if (playMsg.type === PlaylistMessageType.END) {
    const req: StoryboardRequestMessage = {
      groupId: `storyboard-${board.id}-${boardData.currentIdx}`,
      taskId: '',
      recordingId: playMsg.recordingId,
      name: config.name,
      storyboard_idx: boardData.currentIdx,
    };
    const dependencies = Array.from(
      new Array(file.length),
      (v, i) => 'screenshot-' + (file!.firstScreenshot + i).toString()
    );
    await t.createTask(
      producer,
      req,
      'tw-storyboard-request',
      '',
      'storyboard',
      dependencies
    );
    logger.trace({ req }, 'submit last storyboard request');
  }

  if (playMsg.type === PlaylistMessageType.DOWNLOAD) {
    const msg = playMsg as SegmentDownloadedMessage;
    const filesPerBoard = config.rows * config.columns;

    const expected = boardData.lastSegmentSeq + 1;
    if (msg.sequenceNumber < expected) {
      logger.debug({ seq: msg.sequenceNumber }, 'already processed');
      return;
    }
    if (msg.sequenceNumber > expected) {
      // there is no recovering from this
      logger.error(
        { sequence: msg.sequenceNumber, expected },
        'inconsistent sequencenumber'
      );
      return;
    }

    // calculate offset
    let offset = -1;

    // make screenshot for first segment
    if (boardData.lastSegmentSeq === -1) {
      offset = 0;
      boardData.currentOffset = msg.duration;
    } else {
      logger.trace(
        {
          currentOffset: boardData.currentOffset,
          duration: msg.duration,
          interval: config.interval,
        },
        'checking for interval fit'
      );
      // check if we hit the bounds
      if (boardData.currentOffset + msg.duration > config.interval) {
        offset = config.interval - boardData.currentOffset;
        boardData.currentOffset =
          boardData.currentOffset + msg.duration - config.interval;
        logger.trace(
          { currentOffset: boardData.currentOffset, offset },
          'match'
        );
      } else {
        boardData.currentOffset = boardData.currentOffset + msg.duration;
      }
    }

    // update board data
    boardData.lastSegmentSeq = msg.sequenceNumber;

    if (offset > -1) {
      boardData.lastScreenshotIndex++;

      // make screenshot
      const screenshotRequest: ScreenshotRequestMessage = {
        recordingId: msg.recordingId,
        taskId: '',
        groupId: `storyboard-${board.id}-${boardData.currentIdx}`,
        storyboard_idx: file.index,
        screenshot_idx: boardData.lastScreenshotIndex,
        name: config.name,
        seq: msg.sequenceNumber,
        offset,
        width: config.width,
      };

      // check if board file is full
      if (Number(file.length) === filesPerBoard) {
        // make storyboard
        const req: StoryboardRequestMessage = {
          groupId: `storyboard-${board.id}-${boardData.currentIdx}`,
          taskId: '',
          recordingId: playMsg.recordingId,
          name: config.name,
          storyboard_idx: boardData.currentIdx,
        };
        const dependencies = Array.from(
          new Array(file.length),
          (v, i) => 'screenshot-' + (file!.firstScreenshot + i).toString()
        );
        await t.createTask(
          producer,
          req,
          'tw-storyboard-request',
          '',
          'storyboard',
          dependencies
        );

        // new file
        const fileData: StoryboardFileData = {
          screenshots: [screenshotRequest],
        };
        file = await client.storyboardFile.create({
          data: {
            storyboardId: board.id,
            firstSequence: msg.sequenceNumber,
            firstScreenshot: boardData.lastScreenshotIndex,
            index: boardData.currentIdx + 1,
            length: 1,
            slug: randomUUID().replaceAll(/\-/g, ''),
            timeOffset: msg.offset + offset,
            data: fileData as any,
          },
        });

        // update board data
        boardData.currentIdx++;

        // adjust screenshot request to new file
        screenshotRequest.storyboard_idx = boardData.currentIdx;
        screenshotRequest.groupId = `storyboard-${board.id}-${boardData.currentIdx}`;
      } else {
        fileData.screenshots.push(screenshotRequest);
        // update file data
        await client.storyboardFile.update({
          where: {
            id: file.id,
          },
          data: {
            length: file.length + 1,
            data: fileData as any,
          },
        });
      }

      // save screenshot request with adjusted values
      await t.createTask(
        producer,
        screenshotRequest,
        'tw-screenshot-request',
        '',
        'screenshot-' + screenshotRequest.screenshot_idx,
        []
      );
    }

    logger.trace({ ...boardData, segments: [] }, 'updated board data');
    // save board data
    await client.storyboard.update({
      where: {
        id: board.id,
      },
      data: {
        data: boardData as any,
        modified: new Date(),
      },
    });
  }
}
