export interface AccessToken {
  token: string;
  sig: string;
  expires_at: string;
}

export interface Emote {
  id: string;
  source: string;
  name: string;
  ext: string;
}

export interface EmoteData extends Emote {
  start_idx: number;
  end_idx: number;
}

export interface ChatMessage {
  id: string;
  channel: string;
  username: string;
  message: string;
  command: string;
  time: Date;
  data: any;
  emotes: EmoteData[];
}

export interface ChatEmote {
  id: string;
  source: string;
  name: string;
  data: any;
}

/*
  {
  "id": "PerfectAthleticCheetahSMOrc-tixaWW6RGGWPrPLt",
  "url": "https://clips.twitch.tv/PerfectAthleticCheetahSMOrc-tixaWW6RGGWPrPLt",
  "embed_url": "https://clips.twitch.tv/embed?clip=PerfectAthleticCheetahSMOrc-tixaWW6RGGWPrPLt",
  "broadcaster_id": "159498717",
  "broadcaster_name": "Jinnytty",
  "creator_id": "403027202",
  "creator_name": "Tech_IRL",
  "video_id": "1634087691",
  "game_id": "509658",
  "language": "en",
  "title": "Running to the boat",
  "view_count": 7,
  "created_at": "2022-10-26T07:01:30Z",
  "thumbnail_url": "https://clips-media-assets2.twitch.tv/AQTlA7YsWllukRhlj6zy7Q/AT-cm%7CAQTlA7YsWllukRhlj
6zy7Q-preview-480x272.jpg",
  "duration": 60,
  "vod_offset": 30137
  }*/
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
