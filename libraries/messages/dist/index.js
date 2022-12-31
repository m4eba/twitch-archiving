export const ITPlaylistGetLive = {
    events: 'tw-live-events',
    request: 'tw-live-request',
};
export const OTPlaylistGetLive = {
    masterPlaylistText: 'tw-masterPlaylist-text',
};
export const ITPlaylistParseMaster = 'tw-masterPlaylist-text';
export const OTPlaylistParseMaster = {
    playlist: 'tw-playlist',
    recording: 'tw-recording',
    playlistUpdate: 'tw-playlist-update',
    masterPlaylistRequest: 'tw-live-request',
};
export const ITPlaylistUpdate = 'tw-playlist-update';
export const OTPlaylistUpdate = {
    playlistText: 'tw-playlist-text',
    masterPlaylistRequest: 'tw-live-request',
};
export const ITPlaylistParse = 'tw-playlist-text';
export const OTPlaylistParse = 'tw-playlist';
export var PlaylistType;
(function (PlaylistType) {
    PlaylistType[PlaylistType["LIVE"] = 0] = "LIVE";
    PlaylistType[PlaylistType["VOD"] = 1] = "VOD";
})(PlaylistType || (PlaylistType = {}));
export var RecordingMessageType;
(function (RecordingMessageType) {
    RecordingMessageType[RecordingMessageType["STARTED"] = 0] = "STARTED";
    RecordingMessageType[RecordingMessageType["ENDED"] = 1] = "ENDED";
    RecordingMessageType[RecordingMessageType["SEGMENT"] = 2] = "SEGMENT";
})(RecordingMessageType || (RecordingMessageType = {}));
export var MasterPlaylistSourceType;
(function (MasterPlaylistSourceType) {
    MasterPlaylistSourceType[MasterPlaylistSourceType["EVENT"] = 0] = "EVENT";
    MasterPlaylistSourceType[MasterPlaylistSourceType["STREAM_UP_EVENT"] = 1] = "STREAM_UP_EVENT";
    MasterPlaylistSourceType[MasterPlaylistSourceType["REQUEST"] = 2] = "REQUEST";
})(MasterPlaylistSourceType || (MasterPlaylistSourceType = {}));
export var PlaylistMessageType;
(function (PlaylistMessageType) {
    PlaylistMessageType[PlaylistMessageType["START"] = 0] = "START";
    PlaylistMessageType[PlaylistMessageType["END"] = 1] = "END";
    PlaylistMessageType[PlaylistMessageType["DOWNLOAD"] = 2] = "DOWNLOAD";
})(PlaylistMessageType || (PlaylistMessageType = {}));
export var SegmentDownloadedStatus;
(function (SegmentDownloadedStatus) {
    SegmentDownloadedStatus[SegmentDownloadedStatus["DONE"] = 0] = "DONE";
    SegmentDownloadedStatus[SegmentDownloadedStatus["ERROR"] = 1] = "ERROR";
})(SegmentDownloadedStatus || (SegmentDownloadedStatus = {}));
