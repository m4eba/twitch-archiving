
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  decompressFromBase64,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  findSync
} = require('./runtime/library')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
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


  const path = require('path')

const fs = require('fs')

// some frameworks or bundlers replace or totally remove __dirname
const hasDirname = typeof __dirname !== 'undefined' && __dirname !== '/'

// will work in most cases, ie. if the client has not been bundled
const regularDirname = hasDirname && fs.existsSync(path.join(__dirname, 'schema.prisma')) && __dirname

// if the client has been bundled, we need to look for the folders
const foundDirname = !regularDirname && findSync(process.cwd(), [
    "prisma/generated/rec-client",
    "generated/rec-client",
], ['d'], ['d'], 1)[0]

const dirname = regularDirname || foundDirname || __dirname

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

exports.Prisma.StoryboardScalarFieldEnum = makeEnum({
  recordingId: 'recordingId',
  index: 'index',
  firstSequence: 'firstSequence',
  timeOffset: 'timeOffset',
  interval: 'interval',
  rows: 'rows',
  columns: 'columns',
  slug: 'slug',
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
  Task: 'Task'
});

const dmmfString = "{\"datamodel\":{\"enums\":[{\"name\":\"EmoteSource\",\"values\":[{\"name\":\"twitch\",\"dbName\":null},{\"name\":\"bttv\",\"dbName\":null},{\"name\":\"ffz\",\"dbName\":null},{\"name\":\"tv\",\"dbName\":\"7tv\"}],\"dbName\":\"emote_source\"},{\"name\":\"FileStatus\",\"values\":[{\"name\":\"downloading\",\"dbName\":null},{\"name\":\"error\",\"dbName\":null},{\"name\":\"done\",\"dbName\":null},{\"name\":\"waiting\",\"dbName\":null}],\"dbName\":\"file_status\"}],\"models\":[{\"name\":\"ChatEmote\",\"dbName\":\"chat_emote\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"source\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EmoteSource\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ext\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"id\",\"source\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"ChatMessage\",\"dbName\":\"chat_message\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"command\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"ChatMessageEmote\",\"dbName\":\"chat_message_emote\",\"fields\":[{\"name\":\"messageId\",\"dbName\":\"message_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emoteId\",\"dbName\":\"emote_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emoteSource\",\"dbName\":\"emote_source\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startIdx\",\"dbName\":\"start_idx\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endIdx\",\"dbName\":\"end_idx\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"messageId\",\"emoteId\",\"emoteSource\",\"startIdx\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"File\",\"dbName\":\"file\",\"fields\":[{\"name\":\"recordingId\",\"dbName\":\"recording_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seq\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeOffset\",\"dbName\":\"time_offset\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retries\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"datetime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"downloaded\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileStatus\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"recordingId\",\"name\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Recording\",\"dbName\":\"recording\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BigInt\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"start\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stop\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"site_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Storyboard\",\"dbName\":\"storyboard\",\"fields\":[{\"name\":\"recordingId\",\"dbName\":\"recording_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstSequence\",\"dbName\":\"first_sequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeOffset\",\"dbName\":\"time_offset\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interval\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rows\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"columns\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"recordingId\",\"index\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Transcript\",\"dbName\":\"transcript\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BigInt\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordingId\",\"dbName\":\"recording_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transcript\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalStart\",\"dbName\":\"total_start\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalEnd\",\"dbName\":\"total_end\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"segmentSequence\",\"dbName\":\"segment_sequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"audiostart\",\"dbName\":\"audio_start\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"audioEnd\",\"dbName\":\"audio_end\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"confidence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"words\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Clips\",\"dbName\":\"clips\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"last_update\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"broadcaster_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"broadcaster_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"video_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"video_offset\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thumbnail_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"view_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"online\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"ClipsViews\",\"dbName\":\"clips_views\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"view_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"id\",\"view_count\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"RetryLog\",\"dbName\":\"retry_log\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BigInt\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"topic\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Task\",\"dbName\":\"task\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BigInt\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupId\",\"dbName\":\"group_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"task\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dependencies\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"started\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}],\"types\":[]},\"mappings\":{\"modelOperations\":[{\"model\":\"ChatEmote\",\"plural\":\"chatEmotes\",\"findUnique\":\"findUniqueChatEmote\",\"findUniqueOrThrow\":\"findUniqueChatEmoteOrThrow\",\"findFirst\":\"findFirstChatEmote\",\"findFirstOrThrow\":\"findFirstChatEmoteOrThrow\",\"findMany\":\"findManyChatEmote\",\"create\":\"createOneChatEmote\",\"createMany\":\"createManyChatEmote\",\"delete\":\"deleteOneChatEmote\",\"update\":\"updateOneChatEmote\",\"deleteMany\":\"deleteManyChatEmote\",\"updateMany\":\"updateManyChatEmote\",\"upsert\":\"upsertOneChatEmote\",\"aggregate\":\"aggregateChatEmote\",\"groupBy\":\"groupByChatEmote\"},{\"model\":\"ChatMessage\",\"plural\":\"chatMessages\",\"findUnique\":\"findUniqueChatMessage\",\"findUniqueOrThrow\":\"findUniqueChatMessageOrThrow\",\"findFirst\":\"findFirstChatMessage\",\"findFirstOrThrow\":\"findFirstChatMessageOrThrow\",\"findMany\":\"findManyChatMessage\",\"create\":\"createOneChatMessage\",\"createMany\":\"createManyChatMessage\",\"delete\":\"deleteOneChatMessage\",\"update\":\"updateOneChatMessage\",\"deleteMany\":\"deleteManyChatMessage\",\"updateMany\":\"updateManyChatMessage\",\"upsert\":\"upsertOneChatMessage\",\"aggregate\":\"aggregateChatMessage\",\"groupBy\":\"groupByChatMessage\"},{\"model\":\"ChatMessageEmote\",\"plural\":\"chatMessageEmotes\",\"findUnique\":\"findUniqueChatMessageEmote\",\"findUniqueOrThrow\":\"findUniqueChatMessageEmoteOrThrow\",\"findFirst\":\"findFirstChatMessageEmote\",\"findFirstOrThrow\":\"findFirstChatMessageEmoteOrThrow\",\"findMany\":\"findManyChatMessageEmote\",\"create\":\"createOneChatMessageEmote\",\"createMany\":\"createManyChatMessageEmote\",\"delete\":\"deleteOneChatMessageEmote\",\"update\":\"updateOneChatMessageEmote\",\"deleteMany\":\"deleteManyChatMessageEmote\",\"updateMany\":\"updateManyChatMessageEmote\",\"upsert\":\"upsertOneChatMessageEmote\",\"aggregate\":\"aggregateChatMessageEmote\",\"groupBy\":\"groupByChatMessageEmote\"},{\"model\":\"File\",\"plural\":\"files\",\"findUnique\":\"findUniqueFile\",\"findUniqueOrThrow\":\"findUniqueFileOrThrow\",\"findFirst\":\"findFirstFile\",\"findFirstOrThrow\":\"findFirstFileOrThrow\",\"findMany\":\"findManyFile\",\"create\":\"createOneFile\",\"createMany\":\"createManyFile\",\"delete\":\"deleteOneFile\",\"update\":\"updateOneFile\",\"deleteMany\":\"deleteManyFile\",\"updateMany\":\"updateManyFile\",\"upsert\":\"upsertOneFile\",\"aggregate\":\"aggregateFile\",\"groupBy\":\"groupByFile\"},{\"model\":\"Recording\",\"plural\":\"recordings\",\"findUnique\":\"findUniqueRecording\",\"findUniqueOrThrow\":\"findUniqueRecordingOrThrow\",\"findFirst\":\"findFirstRecording\",\"findFirstOrThrow\":\"findFirstRecordingOrThrow\",\"findMany\":\"findManyRecording\",\"create\":\"createOneRecording\",\"createMany\":\"createManyRecording\",\"delete\":\"deleteOneRecording\",\"update\":\"updateOneRecording\",\"deleteMany\":\"deleteManyRecording\",\"updateMany\":\"updateManyRecording\",\"upsert\":\"upsertOneRecording\",\"aggregate\":\"aggregateRecording\",\"groupBy\":\"groupByRecording\"},{\"model\":\"Storyboard\",\"plural\":\"storyboards\",\"findUnique\":\"findUniqueStoryboard\",\"findUniqueOrThrow\":\"findUniqueStoryboardOrThrow\",\"findFirst\":\"findFirstStoryboard\",\"findFirstOrThrow\":\"findFirstStoryboardOrThrow\",\"findMany\":\"findManyStoryboard\",\"create\":\"createOneStoryboard\",\"createMany\":\"createManyStoryboard\",\"delete\":\"deleteOneStoryboard\",\"update\":\"updateOneStoryboard\",\"deleteMany\":\"deleteManyStoryboard\",\"updateMany\":\"updateManyStoryboard\",\"upsert\":\"upsertOneStoryboard\",\"aggregate\":\"aggregateStoryboard\",\"groupBy\":\"groupByStoryboard\"},{\"model\":\"Transcript\",\"plural\":\"transcripts\",\"findUnique\":\"findUniqueTranscript\",\"findUniqueOrThrow\":\"findUniqueTranscriptOrThrow\",\"findFirst\":\"findFirstTranscript\",\"findFirstOrThrow\":\"findFirstTranscriptOrThrow\",\"findMany\":\"findManyTranscript\",\"create\":\"createOneTranscript\",\"createMany\":\"createManyTranscript\",\"delete\":\"deleteOneTranscript\",\"update\":\"updateOneTranscript\",\"deleteMany\":\"deleteManyTranscript\",\"updateMany\":\"updateManyTranscript\",\"upsert\":\"upsertOneTranscript\",\"aggregate\":\"aggregateTranscript\",\"groupBy\":\"groupByTranscript\"},{\"model\":\"Clips\",\"plural\":\"clips\",\"findUnique\":\"findUniqueClips\",\"findUniqueOrThrow\":\"findUniqueClipsOrThrow\",\"findFirst\":\"findFirstClips\",\"findFirstOrThrow\":\"findFirstClipsOrThrow\",\"findMany\":\"findManyClips\",\"create\":\"createOneClips\",\"createMany\":\"createManyClips\",\"delete\":\"deleteOneClips\",\"update\":\"updateOneClips\",\"deleteMany\":\"deleteManyClips\",\"updateMany\":\"updateManyClips\",\"upsert\":\"upsertOneClips\",\"aggregate\":\"aggregateClips\",\"groupBy\":\"groupByClips\"},{\"model\":\"ClipsViews\",\"plural\":\"clipsViews\",\"findUnique\":\"findUniqueClipsViews\",\"findUniqueOrThrow\":\"findUniqueClipsViewsOrThrow\",\"findFirst\":\"findFirstClipsViews\",\"findFirstOrThrow\":\"findFirstClipsViewsOrThrow\",\"findMany\":\"findManyClipsViews\",\"create\":\"createOneClipsViews\",\"createMany\":\"createManyClipsViews\",\"delete\":\"deleteOneClipsViews\",\"update\":\"updateOneClipsViews\",\"deleteMany\":\"deleteManyClipsViews\",\"updateMany\":\"updateManyClipsViews\",\"upsert\":\"upsertOneClipsViews\",\"aggregate\":\"aggregateClipsViews\",\"groupBy\":\"groupByClipsViews\"},{\"model\":\"RetryLog\",\"plural\":\"retryLogs\",\"findUnique\":\"findUniqueRetryLog\",\"findUniqueOrThrow\":\"findUniqueRetryLogOrThrow\",\"findFirst\":\"findFirstRetryLog\",\"findFirstOrThrow\":\"findFirstRetryLogOrThrow\",\"findMany\":\"findManyRetryLog\",\"create\":\"createOneRetryLog\",\"createMany\":\"createManyRetryLog\",\"delete\":\"deleteOneRetryLog\",\"update\":\"updateOneRetryLog\",\"deleteMany\":\"deleteManyRetryLog\",\"updateMany\":\"updateManyRetryLog\",\"upsert\":\"upsertOneRetryLog\",\"aggregate\":\"aggregateRetryLog\",\"groupBy\":\"groupByRetryLog\"},{\"model\":\"Task\",\"plural\":\"tasks\",\"findUnique\":\"findUniqueTask\",\"findUniqueOrThrow\":\"findUniqueTaskOrThrow\",\"findFirst\":\"findFirstTask\",\"findFirstOrThrow\":\"findFirstTaskOrThrow\",\"findMany\":\"findManyTask\",\"create\":\"createOneTask\",\"createMany\":\"createManyTask\",\"delete\":\"deleteOneTask\",\"update\":\"updateOneTask\",\"deleteMany\":\"deleteManyTask\",\"updateMany\":\"updateManyTask\",\"upsert\":\"upsertOneTask\",\"aggregate\":\"aggregateTask\",\"groupBy\":\"groupByTask\"}],\"otherOperations\":{\"read\":[],\"write\":[\"executeRaw\",\"queryRaw\"]}}}"
const dmmf = JSON.parse(dmmfString)
exports.Prisma.dmmf = JSON.parse(dmmfString)

/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/petschm/dev/twitch/twitch-archiving/libraries/prisma/prisma/generated/rec-client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "4.11.0",
  "engineVersion": "8fde8fef4033376662cad983758335009d522acb",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "dataProxy": false
}
config.dirname = dirname
config.document = dmmf




const { warnEnvConflicts } = require('./runtime/library')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath)
})


const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

path.join(__dirname, "libquery_engine-debian-openssl-1.0.x.so.node");
path.join(process.cwd(), "prisma/generated/rec-client/libquery_engine-debian-openssl-1.0.x.so.node")
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/generated/rec-client/schema.prisma")
