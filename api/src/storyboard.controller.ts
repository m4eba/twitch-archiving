import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  NotFoundException,
  Header,
} from '@nestjs/common';
import { RecPrismaClient } from '@twitch-archiving/prisma';
import { createReadStream } from 'fs';
import { Request, Response } from 'express';
import path from 'path';
import { StoryboardInfo } from './storyboard.model.js';
import { fileExists } from '@twitch-archiving/utils';

const client = new RecPrismaClient();

@Controller('storyboard')
export class StoryboardController {
  @Get('/:id/:name/')
  @Header('Cache-Control', 'public,max-age=3600')
  async playlist(
    @Param('id') id,
    @Param('name') name,
  ): Promise<StoryboardInfo> {
    const recording = await client.recording.findFirst({
      where: {
        site_id: id,
      },
    });
    if (recording === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const storyboard = await client.storyboard.findFirst({
      where: {
        recordingId: recording.id,
        name,
      },
    });
    if (storyboard === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const count: [{ count: bigint }] =
      await client.$queryRaw`select count(*) as count from storyboard_file where storyboard_id = ${storyboard.id} `;

    const info: StoryboardInfo = {
      id,
      interval: storyboard.interval,
      rows: storyboard.rows,
      columns: storyboard.columns,
      width: storyboard.width,
      height: storyboard.height,
      fileCount: Number(count[0].count),
    };

    return info;
  }

  @Get('/:id/:name/:file.png')
  @Header('Cache-Control', 'public,max-age=2592000')
  async file(
    @Param('id') id,
    @Param('name') name,
    @Param('file') file,
    @Res() response: Response,
  ): Promise<void> {
    const recording = await client.recording.findFirst({
      where: {
        site_id: id,
      },
    });
    if (recording === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const storyboard = await client.storyboard.findFirst({
      where: {
        recordingId: recording.id,
        name,
      },
    });
    if (storyboard === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const filename = path.join(
      process.env.STORYBOARD_PATH,
      recording.id.toString(),
      name,
      file + '.png',
    );

    if (!(await fileExists(filename))) {
      throw new NotFoundException();
    }

    const fst = createReadStream(filename);
    fst.pipe(response);
  }
}
