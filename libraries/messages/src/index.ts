export interface AccessToken {
  token: string;
  sig: string;
  expires_at: string;
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

export interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset: number;
}

export interface TwitchClipResponse {
  data: TwitchClip[];
  pagination: {
    cursor: string;
  };
}

export interface TwitchClipAccessToken {
  clip: {
    videoQualities: {
      sourceURL: string;
    }[];
    playbackAccessToken: {
      signature: string;
      value: string;
    };
  };
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
