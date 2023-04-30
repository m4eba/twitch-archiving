
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.11.0
 * Query Engine version: 8fde8fef4033376662cad983758335009d522acb
 */
Prisma.prismaVersion = {
  client: "4.11.0",
  engine: "8fde8fef4033376662cad983758335009d522acb"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.ChatEmoteScalarFieldEnum = makeEnum({
  id: 'id',
  source: 'source',
  name: 'name',
  ext: 'ext',
  data: 'data'
});

exports.Prisma.ChatMessageEmoteScalarFieldEnum = makeEnum({
  messageId: 'messageId',
  emoteId: 'emoteId',
  emoteSource: 'emoteSource',
  startIdx: 'startIdx',
  endIdx: 'endIdx'
});

exports.Prisma.ChatMessageScalarFieldEnum = makeEnum({
  id: 'id',
  channel: 'channel',
  username: 'username',
  message: 'message',
  command: 'command',
  time: 'time',
  data: 'data',
  emotes: 'emotes'
});

exports.Prisma.ClipsScalarFieldEnum = makeEnum({
  id: 'id',
  created_at: 'created_at',
  last_update: 'last_update',
  broadcaster_id: 'broadcaster_id',
  broadcaster_name: 'broadcaster_name',
  creator_id: 'creator_id',
  creator_name: 'creator_name',
  title: 'title',
  video_id: 'video_id',
  video_offset: 'video_offset',
  thumbnail_url: 'thumbnail_url',
  view_count: 'view_count',
  duration: 'duration',
  online: 'online',
  data: 'data'
});

exports.Prisma.ClipsViewsScalarFieldEnum = makeEnum({
  id: 'id',
  date: 'date',
  view_count: 'view_count'
});

exports.Prisma.FileScalarFieldEnum = makeEnum({
  recordingId: 'recordingId',
  name: 'name',
  seq: 'seq',
  timeOffset: 'timeOffset',
  duration: 'duration',
  retries: 'retries',
  datetime: 'datetime',
  size: 'size',
  downloaded: 'downloaded',
  hash: 'hash',
  status: 'status'
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
});

exports.Prisma.JsonNullValueInput = makeEnum({
  JsonNull: Prisma.JsonNull
});

exports.Prisma.NullableJsonNullValueInput = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.RecordingScalarFieldEnum = makeEnum({
  id: 'id',
  start: 'start',
  stop: 'stop',
  channel: 'channel',
  site_id: 'site_id',
  data: 'data'
});

exports.Prisma.RetryLogScalarFieldEnum = makeEnum({
  id: 'id',
  topic: 'topic',
  time: 'time',
  data: 'data'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.StoryboardFileScalarFieldEnum = makeEnum({
  id: 'id',
  storyboardId: 'storyboardId',
  index: 'index',
  firstSequence: 'firstSequence',
  firstScreenshot: 'firstScreenshot',
  length: 'length',
  timeOffset: 'timeOffset',
  slug: 'slug',
  data: 'data'
});

exports.Prisma.StoryboardScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  recordingId: 'recordingId',
  interval: 'interval',
  rows: 'rows',
  columns: 'columns',
  width: 'width',
  height: 'height',
  data: 'data'
});

exports.Prisma.TaskScalarFieldEnum = makeEnum({
  id: 'id',
  groupId: 'groupId',
  task: 'task',
  dependencies: 'dependencies',
  started: 'started',
  completed: 'completed',
  data: 'data'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TranscriptScalarFieldEnum = makeEnum({
  id: 'id',
  recordingId: 'recordingId',
  transcript: 'transcript',
  totalStart: 'totalStart',
  totalEnd: 'totalEnd',
  segmentSequence: 'segmentSequence',
  audiostart: 'audiostart',
  audioEnd: 'audioEnd',
  confidence: 'confidence',
  created: 'created',
  words: 'words'
});
exports.EmoteSource = makeEnum({
  twitch: 'twitch',
  bttv: 'bttv',
  ffz: 'ffz',
  tv: 'tv'
});

exports.FileStatus = makeEnum({
  downloading: 'downloading',
  error: 'error',
  done: 'done',
  waiting: 'waiting'
});

exports.Prisma.ModelName = makeEnum({
  ChatEmote: 'ChatEmote',
  ChatMessage: 'ChatMessage',
  ChatMessageEmote: 'ChatMessageEmote',
  File: 'File',
  Recording: 'Recording',
  Storyboard: 'Storyboard',
  Transcript: 'Transcript',
  Clips: 'Clips',
  ClipsViews: 'ClipsViews',
  RetryLog: 'RetryLog',
  Task: 'Task',
  StoryboardFile: 'StoryboardFile'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
