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
