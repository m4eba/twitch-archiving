import { TwitchClip, AccessToken } from '@twitch-archiving/model';

export interface TaskRequestMsg {
  groupId: string;
  taskId: string;
}

export interface TaskDoneMsg extends TaskRequestMsg {}

export interface TaskData<T extends TaskRequestMsg> {
  topic: string;
  key: string;
  data: T;
}

export interface WebsocketMessage {
  data: string;
}

export interface IRCMessage {
  raw: string;
  tags: Record<string, string>;
  prefix: string;
  command: string;
  params: string[];
}

export enum PlaylistType {
  LIVE,
  VOD,
}

export enum RecordingMessageType {
  STARTED,
  ENDED,
  SEGMENT,
}

export interface RecordingMessage {
  type: RecordingMessageType;
  user: string;
  id: string;
  recordingId: string;
  playlistType: PlaylistType;
}

export interface RecordingStartedMessage extends RecordingMessage {}

export interface RecordingEndedMessage extends RecordingMessage {
  segmentCount: number;
}

export interface RecordingSegmentMessage extends RecordingMessage {
  sequenceNumber: number;
  offset: number;
  duration: number;
  time: string;
  url: string;
}

export interface PlaylistRequestMessage {
  user: string;
  id: string;
  recordingId: string;
  type: PlaylistType;
  playlist: string;
  token: AccessToken;
  url: string;
}

export enum PlaylistMessageType {
  START,
  END,
  DOWNLOAD,
}

export interface PlaylistMessage {
  type: PlaylistMessageType;
  user: string;
  id: string;
  recordingId: string;
}

export enum SegmentDownloadedStatus {
  DONE,
  ERROR,
}
export interface SegmentDownloadedMessage extends PlaylistMessage {
  sequenceNumber: number;
  offset: number;
  duration: number;
  filename: string;
  path: string;
  status: SegmentDownloadedStatus;
}

export interface ScreenshotRequestMessage extends TaskRequestMsg {
  recordingId: string;
  name: string;
  storyboard_idx: number;
  screenshot_idx: number;
  seq: number;
  offset: number;
  width: number;
}

export interface StoryboardRequestMessage extends TaskRequestMsg {
  recordingId: string;
  name: string;
  storyboard_idx: number;
}

export interface StoryboardData {
  currentOffset: number;
  currentIdx: number;
  lastSegmentSeq: number;
  lastScreenshotIndex: number;
}

export interface StoryboardFileData {
  screenshots: ScreenshotRequestMessage[];
}

export interface ScreenshotMessage {
  segment: SegmentDownloadedMessage;
  index: number;
  offset: number;
}

export interface ScreenshotDoneMessage {
  recordingId: string;
  index: number;
  filename: string;
  path: string;
}

export interface StoryboardDoneMessage {
  recordingId: string;
  index: number;
  count: number;
  rows: number;
  columns: number;
  path: string;
  filename: string;
}

export interface ClipsList {
  channel: string;
  channel_id: string;
  start: string;
  end: string;
  pagination: string;
  count: number;
  accessToken: string;
}

export interface ClipDownload {
  channel: string;
  clip: TwitchClip;
}
