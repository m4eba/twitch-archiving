import type { AccessToken } from '@twitch-archiving/twitch';

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

export interface RecordingStartedMessage {
  user: string;
  id: string;
  recordingId: string;
  type: PlaylistType;
}

export interface RecordingEndedMessage {
  user: string;
  id: string;
  recordingId: string;
  segmentCount: number;
}

export interface PlaylistMessage {
  user: string;
  id: string;
  recordingId: string;
  type: PlaylistType;
  playlist: string;
  token: AccessToken;
  url: string;
}

export interface PlaylistSegmentMessage {
  user: string;
  id: string;
  recordingId: string;
  type: PlaylistType;
  sequenceNumber: number;
  duration: number;
  time: string;
  url: string;
}

export enum SegmentDownloadedStatus {
  DONE,
  ERROR,
}
export interface SegmentDownloadedMessage {
  user: string;
  id: string;
  recordingId: string;
  sequenceNumber: number;
  duration: number;
  filename: string;
  path: string;
  status: SegmentDownloadedStatus;
}

export interface ScreenshotMessage {
  segment: PlaylistSegmentMessage;
  index: number;
  offset: number;
}

export interface ScreenshotDoneMessage {
  recordingId: string;
  index: number;
  offset: number;
  filename: string;
  path: string;
}
