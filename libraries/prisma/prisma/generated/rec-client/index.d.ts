
/**
 * Client
**/

import * as runtime from './runtime/library';
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends Prisma.PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model ChatEmote
 * 
 */
export type ChatEmote = {
  id: string
  source: EmoteSource
  name: string
  ext: string
  data: Prisma.JsonValue
}

/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = {
  id: string
  channel: string
  username: string
  message: string
  command: string
  time: Date
  data: Prisma.JsonValue
  emotes: Prisma.JsonValue
}

/**
 * Model ChatMessageEmote
 * 
 */
export type ChatMessageEmote = {
  messageId: string
  emoteId: string
  emoteSource: string
  startIdx: number
  endIdx: number
}

/**
 * Model File
 * 
 */
export type File = {
  recordingId: bigint
  name: string
  seq: number
  timeOffset: Prisma.Decimal
  duration: Prisma.Decimal
  retries: number
  datetime: Date
  size: number
  downloaded: number
  hash: string
  status: FileStatus | null
}

/**
 * Model Recording
 * 
 */
export type Recording = {
  id: bigint
  start: Date
  stop: Date | null
  channel: string
  site_id: string
  data: Prisma.JsonValue | null
}

/**
 * Model Storyboard
 * 
 */
export type Storyboard = {
  recordingId: bigint
  index: number
  firstSequence: number
  timeOffset: Prisma.Decimal
  interval: number
  rows: number
  columns: number
  slug: string
  data: Prisma.JsonValue
}

/**
 * Model Transcript
 * 
 */
export type Transcript = {
  id: bigint
  recordingId: bigint
  transcript: string
  totalStart: number
  totalEnd: number
  segmentSequence: number
  audiostart: number
  audioEnd: number
  confidence: number
  created: Date
  words: Prisma.JsonValue
}

/**
 * Model Clips
 * 
 */
export type Clips = {
  id: string
  created_at: Date
  last_update: Date
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  title: string
  video_id: string
  video_offset: number
  thumbnail_url: string
  view_count: number
  duration: Prisma.Decimal
  online: boolean
  data: Prisma.JsonValue | null
}

/**
 * Model ClipsViews
 * 
 */
export type ClipsViews = {
  id: string
  date: Date
  view_count: number
}

/**
 * Model RetryLog
 * 
 */
export type RetryLog = {
  id: bigint
  topic: string
  time: Date
  data: Prisma.JsonValue
}

/**
 * Model Task
 * 
 */
export type Task = {
  id: bigint
  groupId: bigint
  task: string
  dependencies: string[]
  started: Date | null
  completed: Date | null
  data: Prisma.JsonValue
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const EmoteSource: {
  twitch: 'twitch',
  bttv: 'bttv',
  ffz: 'ffz',
  tv: 'tv'
};

export type EmoteSource = (typeof EmoteSource)[keyof typeof EmoteSource]


export const FileStatus: {
  downloading: 'downloading',
  error: 'error',
  done: 'done',
  waiting: 'waiting'
};

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ChatEmotes
 * const chatEmotes = await prisma.chatEmote.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ChatEmotes
   * const chatEmotes = await prisma.chatEmote.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<this, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>

      /**
   * `prisma.chatEmote`: Exposes CRUD operations for the **ChatEmote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatEmotes
    * const chatEmotes = await prisma.chatEmote.findMany()
    * ```
    */
  get chatEmote(): Prisma.ChatEmoteDelegate<GlobalReject>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<GlobalReject>;

  /**
   * `prisma.chatMessageEmote`: Exposes CRUD operations for the **ChatMessageEmote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessageEmotes
    * const chatMessageEmotes = await prisma.chatMessageEmote.findMany()
    * ```
    */
  get chatMessageEmote(): Prisma.ChatMessageEmoteDelegate<GlobalReject>;

  /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<GlobalReject>;

  /**
   * `prisma.recording`: Exposes CRUD operations for the **Recording** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recordings
    * const recordings = await prisma.recording.findMany()
    * ```
    */
  get recording(): Prisma.RecordingDelegate<GlobalReject>;

  /**
   * `prisma.storyboard`: Exposes CRUD operations for the **Storyboard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Storyboards
    * const storyboards = await prisma.storyboard.findMany()
    * ```
    */
  get storyboard(): Prisma.StoryboardDelegate<GlobalReject>;

  /**
   * `prisma.transcript`: Exposes CRUD operations for the **Transcript** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transcripts
    * const transcripts = await prisma.transcript.findMany()
    * ```
    */
  get transcript(): Prisma.TranscriptDelegate<GlobalReject>;

  /**
   * `prisma.clips`: Exposes CRUD operations for the **Clips** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clips
    * const clips = await prisma.clips.findMany()
    * ```
    */
  get clips(): Prisma.ClipsDelegate<GlobalReject>;

  /**
   * `prisma.clipsViews`: Exposes CRUD operations for the **ClipsViews** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClipsViews
    * const clipsViews = await prisma.clipsViews.findMany()
    * ```
    */
  get clipsViews(): Prisma.ClipsViewsDelegate<GlobalReject>;

  /**
   * `prisma.retryLog`: Exposes CRUD operations for the **RetryLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetryLogs
    * const retryLogs = await prisma.retryLog.findMany()
    * ```
    */
  get retryLog(): Prisma.RetryLogDelegate<GlobalReject>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.11.0
   * Query Engine version: 8fde8fef4033376662cad983758335009d522acb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: runtime.Types.Utils.LegacyExact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ChatEmote
   */


  export type AggregateChatEmote = {
    _count: ChatEmoteCountAggregateOutputType | null
    _min: ChatEmoteMinAggregateOutputType | null
    _max: ChatEmoteMaxAggregateOutputType | null
  }

  export type ChatEmoteMinAggregateOutputType = {
    id: string | null
    source: EmoteSource | null
    name: string | null
    ext: string | null
  }

  export type ChatEmoteMaxAggregateOutputType = {
    id: string | null
    source: EmoteSource | null
    name: string | null
    ext: string | null
  }

  export type ChatEmoteCountAggregateOutputType = {
    id: number
    source: number
    name: number
    ext: number
    data: number
    _all: number
  }


  export type ChatEmoteMinAggregateInputType = {
    id?: true
    source?: true
    name?: true
    ext?: true
  }

  export type ChatEmoteMaxAggregateInputType = {
    id?: true
    source?: true
    name?: true
    ext?: true
  }

  export type ChatEmoteCountAggregateInputType = {
    id?: true
    source?: true
    name?: true
    ext?: true
    data?: true
    _all?: true
  }

  export type ChatEmoteAggregateArgs = {
    /**
     * Filter which ChatEmote to aggregate.
     */
    where?: ChatEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatEmotes to fetch.
     */
    orderBy?: Enumerable<ChatEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatEmotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatEmotes
    **/
    _count?: true | ChatEmoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatEmoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatEmoteMaxAggregateInputType
  }

  export type GetChatEmoteAggregateType<T extends ChatEmoteAggregateArgs> = {
        [P in keyof T & keyof AggregateChatEmote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatEmote[P]>
      : GetScalarType<T[P], AggregateChatEmote[P]>
  }




  export type ChatEmoteGroupByArgs = {
    where?: ChatEmoteWhereInput
    orderBy?: Enumerable<ChatEmoteOrderByWithAggregationInput>
    by: ChatEmoteScalarFieldEnum[]
    having?: ChatEmoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatEmoteCountAggregateInputType | true
    _min?: ChatEmoteMinAggregateInputType
    _max?: ChatEmoteMaxAggregateInputType
  }


  export type ChatEmoteGroupByOutputType = {
    id: string
    source: EmoteSource
    name: string
    ext: string
    data: JsonValue
    _count: ChatEmoteCountAggregateOutputType | null
    _min: ChatEmoteMinAggregateOutputType | null
    _max: ChatEmoteMaxAggregateOutputType | null
  }

  type GetChatEmoteGroupByPayload<T extends ChatEmoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ChatEmoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatEmoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatEmoteGroupByOutputType[P]>
            : GetScalarType<T[P], ChatEmoteGroupByOutputType[P]>
        }
      >
    >


  export type ChatEmoteSelect = {
    id?: boolean
    source?: boolean
    name?: boolean
    ext?: boolean
    data?: boolean
  }


  export type ChatEmoteGetPayload<S extends boolean | null | undefined | ChatEmoteArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? ChatEmote :
    S extends undefined ? never :
    S extends { include: any } & (ChatEmoteArgs | ChatEmoteFindManyArgs)
    ? ChatEmote 
    : S extends { select: any } & (ChatEmoteArgs | ChatEmoteFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof ChatEmote ? ChatEmote[P] : never
  } 
      : ChatEmote


  type ChatEmoteCountArgs = 
    Omit<ChatEmoteFindManyArgs, 'select' | 'include'> & {
      select?: ChatEmoteCountAggregateInputType | true
    }

  export interface ChatEmoteDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one ChatEmote that matches the filter.
     * @param {ChatEmoteFindUniqueArgs} args - Arguments to find a ChatEmote
     * @example
     * // Get one ChatEmote
     * const chatEmote = await prisma.chatEmote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ChatEmoteFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ChatEmoteFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ChatEmote'> extends True ? Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>> : Prisma__ChatEmoteClient<ChatEmoteGetPayload<T> | null, null>

    /**
     * Find one ChatEmote that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ChatEmoteFindUniqueOrThrowArgs} args - Arguments to find a ChatEmote
     * @example
     * // Get one ChatEmote
     * const chatEmote = await prisma.chatEmote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ChatEmoteFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ChatEmoteFindUniqueOrThrowArgs>
    ): Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>>

    /**
     * Find the first ChatEmote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteFindFirstArgs} args - Arguments to find a ChatEmote
     * @example
     * // Get one ChatEmote
     * const chatEmote = await prisma.chatEmote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ChatEmoteFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ChatEmoteFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ChatEmote'> extends True ? Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>> : Prisma__ChatEmoteClient<ChatEmoteGetPayload<T> | null, null>

    /**
     * Find the first ChatEmote that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteFindFirstOrThrowArgs} args - Arguments to find a ChatEmote
     * @example
     * // Get one ChatEmote
     * const chatEmote = await prisma.chatEmote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ChatEmoteFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ChatEmoteFindFirstOrThrowArgs>
    ): Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>>

    /**
     * Find zero or more ChatEmotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatEmotes
     * const chatEmotes = await prisma.chatEmote.findMany()
     * 
     * // Get first 10 ChatEmotes
     * const chatEmotes = await prisma.chatEmote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatEmoteWithIdOnly = await prisma.chatEmote.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ChatEmoteFindManyArgs>(
      args?: SelectSubset<T, ChatEmoteFindManyArgs>
    ): Prisma.PrismaPromise<Array<ChatEmoteGetPayload<T>>>

    /**
     * Create a ChatEmote.
     * @param {ChatEmoteCreateArgs} args - Arguments to create a ChatEmote.
     * @example
     * // Create one ChatEmote
     * const ChatEmote = await prisma.chatEmote.create({
     *   data: {
     *     // ... data to create a ChatEmote
     *   }
     * })
     * 
    **/
    create<T extends ChatEmoteCreateArgs>(
      args: SelectSubset<T, ChatEmoteCreateArgs>
    ): Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>>

    /**
     * Create many ChatEmotes.
     *     @param {ChatEmoteCreateManyArgs} args - Arguments to create many ChatEmotes.
     *     @example
     *     // Create many ChatEmotes
     *     const chatEmote = await prisma.chatEmote.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ChatEmoteCreateManyArgs>(
      args?: SelectSubset<T, ChatEmoteCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatEmote.
     * @param {ChatEmoteDeleteArgs} args - Arguments to delete one ChatEmote.
     * @example
     * // Delete one ChatEmote
     * const ChatEmote = await prisma.chatEmote.delete({
     *   where: {
     *     // ... filter to delete one ChatEmote
     *   }
     * })
     * 
    **/
    delete<T extends ChatEmoteDeleteArgs>(
      args: SelectSubset<T, ChatEmoteDeleteArgs>
    ): Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>>

    /**
     * Update one ChatEmote.
     * @param {ChatEmoteUpdateArgs} args - Arguments to update one ChatEmote.
     * @example
     * // Update one ChatEmote
     * const chatEmote = await prisma.chatEmote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ChatEmoteUpdateArgs>(
      args: SelectSubset<T, ChatEmoteUpdateArgs>
    ): Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>>

    /**
     * Delete zero or more ChatEmotes.
     * @param {ChatEmoteDeleteManyArgs} args - Arguments to filter ChatEmotes to delete.
     * @example
     * // Delete a few ChatEmotes
     * const { count } = await prisma.chatEmote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ChatEmoteDeleteManyArgs>(
      args?: SelectSubset<T, ChatEmoteDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatEmotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatEmotes
     * const chatEmote = await prisma.chatEmote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ChatEmoteUpdateManyArgs>(
      args: SelectSubset<T, ChatEmoteUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatEmote.
     * @param {ChatEmoteUpsertArgs} args - Arguments to update or create a ChatEmote.
     * @example
     * // Update or create a ChatEmote
     * const chatEmote = await prisma.chatEmote.upsert({
     *   create: {
     *     // ... data to create a ChatEmote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatEmote we want to update
     *   }
     * })
    **/
    upsert<T extends ChatEmoteUpsertArgs>(
      args: SelectSubset<T, ChatEmoteUpsertArgs>
    ): Prisma__ChatEmoteClient<ChatEmoteGetPayload<T>>

    /**
     * Count the number of ChatEmotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteCountArgs} args - Arguments to filter ChatEmotes to count.
     * @example
     * // Count the number of ChatEmotes
     * const count = await prisma.chatEmote.count({
     *   where: {
     *     // ... the filter for the ChatEmotes we want to count
     *   }
     * })
    **/
    count<T extends ChatEmoteCountArgs>(
      args?: Subset<T, ChatEmoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatEmoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatEmote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatEmoteAggregateArgs>(args: Subset<T, ChatEmoteAggregateArgs>): Prisma.PrismaPromise<GetChatEmoteAggregateType<T>>

    /**
     * Group by ChatEmote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatEmoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatEmoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatEmoteGroupByArgs['orderBy'] }
        : { orderBy?: ChatEmoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatEmoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatEmoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatEmote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ChatEmoteClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ChatEmote base type for findUnique actions
   */
  export type ChatEmoteFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * Filter, which ChatEmote to fetch.
     */
    where: ChatEmoteWhereUniqueInput
  }

  /**
   * ChatEmote findUnique
   */
  export interface ChatEmoteFindUniqueArgs extends ChatEmoteFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ChatEmote findUniqueOrThrow
   */
  export type ChatEmoteFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * Filter, which ChatEmote to fetch.
     */
    where: ChatEmoteWhereUniqueInput
  }


  /**
   * ChatEmote base type for findFirst actions
   */
  export type ChatEmoteFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * Filter, which ChatEmote to fetch.
     */
    where?: ChatEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatEmotes to fetch.
     */
    orderBy?: Enumerable<ChatEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatEmotes.
     */
    cursor?: ChatEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatEmotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatEmotes.
     */
    distinct?: Enumerable<ChatEmoteScalarFieldEnum>
  }

  /**
   * ChatEmote findFirst
   */
  export interface ChatEmoteFindFirstArgs extends ChatEmoteFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ChatEmote findFirstOrThrow
   */
  export type ChatEmoteFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * Filter, which ChatEmote to fetch.
     */
    where?: ChatEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatEmotes to fetch.
     */
    orderBy?: Enumerable<ChatEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatEmotes.
     */
    cursor?: ChatEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatEmotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatEmotes.
     */
    distinct?: Enumerable<ChatEmoteScalarFieldEnum>
  }


  /**
   * ChatEmote findMany
   */
  export type ChatEmoteFindManyArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * Filter, which ChatEmotes to fetch.
     */
    where?: ChatEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatEmotes to fetch.
     */
    orderBy?: Enumerable<ChatEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatEmotes.
     */
    cursor?: ChatEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatEmotes.
     */
    skip?: number
    distinct?: Enumerable<ChatEmoteScalarFieldEnum>
  }


  /**
   * ChatEmote create
   */
  export type ChatEmoteCreateArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * The data needed to create a ChatEmote.
     */
    data: XOR<ChatEmoteCreateInput, ChatEmoteUncheckedCreateInput>
  }


  /**
   * ChatEmote createMany
   */
  export type ChatEmoteCreateManyArgs = {
    /**
     * The data used to create many ChatEmotes.
     */
    data: Enumerable<ChatEmoteCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ChatEmote update
   */
  export type ChatEmoteUpdateArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * The data needed to update a ChatEmote.
     */
    data: XOR<ChatEmoteUpdateInput, ChatEmoteUncheckedUpdateInput>
    /**
     * Choose, which ChatEmote to update.
     */
    where: ChatEmoteWhereUniqueInput
  }


  /**
   * ChatEmote updateMany
   */
  export type ChatEmoteUpdateManyArgs = {
    /**
     * The data used to update ChatEmotes.
     */
    data: XOR<ChatEmoteUpdateManyMutationInput, ChatEmoteUncheckedUpdateManyInput>
    /**
     * Filter which ChatEmotes to update
     */
    where?: ChatEmoteWhereInput
  }


  /**
   * ChatEmote upsert
   */
  export type ChatEmoteUpsertArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * The filter to search for the ChatEmote to update in case it exists.
     */
    where: ChatEmoteWhereUniqueInput
    /**
     * In case the ChatEmote found by the `where` argument doesn't exist, create a new ChatEmote with this data.
     */
    create: XOR<ChatEmoteCreateInput, ChatEmoteUncheckedCreateInput>
    /**
     * In case the ChatEmote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatEmoteUpdateInput, ChatEmoteUncheckedUpdateInput>
  }


  /**
   * ChatEmote delete
   */
  export type ChatEmoteDeleteArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
    /**
     * Filter which ChatEmote to delete.
     */
    where: ChatEmoteWhereUniqueInput
  }


  /**
   * ChatEmote deleteMany
   */
  export type ChatEmoteDeleteManyArgs = {
    /**
     * Filter which ChatEmotes to delete
     */
    where?: ChatEmoteWhereInput
  }


  /**
   * ChatEmote without action
   */
  export type ChatEmoteArgs = {
    /**
     * Select specific fields to fetch from the ChatEmote
     */
    select?: ChatEmoteSelect | null
  }



  /**
   * Model ChatMessage
   */


  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    channel: string | null
    username: string | null
    message: string | null
    command: string | null
    time: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    channel: string | null
    username: string | null
    message: string | null
    command: string | null
    time: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    channel: number
    username: number
    message: number
    command: number
    time: number
    data: number
    emotes: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    channel?: true
    username?: true
    message?: true
    command?: true
    time?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    channel?: true
    username?: true
    message?: true
    command?: true
    time?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    channel?: true
    username?: true
    message?: true
    command?: true
    time?: true
    data?: true
    emotes?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Enumerable<ChatMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs = {
    where?: ChatMessageWhereInput
    orderBy?: Enumerable<ChatMessageOrderByWithAggregationInput>
    by: ChatMessageScalarFieldEnum[]
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }


  export type ChatMessageGroupByOutputType = {
    id: string
    channel: string
    username: string
    message: string
    command: string
    time: Date
    data: JsonValue
    emotes: JsonValue
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect = {
    id?: boolean
    channel?: boolean
    username?: boolean
    message?: boolean
    command?: boolean
    time?: boolean
    data?: boolean
    emotes?: boolean
  }


  export type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? ChatMessage :
    S extends undefined ? never :
    S extends { include: any } & (ChatMessageArgs | ChatMessageFindManyArgs)
    ? ChatMessage 
    : S extends { select: any } & (ChatMessageArgs | ChatMessageFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof ChatMessage ? ChatMessage[P] : never
  } 
      : ChatMessage


  type ChatMessageCountArgs = 
    Omit<ChatMessageFindManyArgs, 'select' | 'include'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ChatMessageFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ChatMessageFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ChatMessage'> extends True ? Prisma__ChatMessageClient<ChatMessageGetPayload<T>> : Prisma__ChatMessageClient<ChatMessageGetPayload<T> | null, null>

    /**
     * Find one ChatMessage that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs>
    ): Prisma__ChatMessageClient<ChatMessageGetPayload<T>>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ChatMessageFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ChatMessageFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ChatMessage'> extends True ? Prisma__ChatMessageClient<ChatMessageGetPayload<T>> : Prisma__ChatMessageClient<ChatMessageGetPayload<T> | null, null>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs>
    ): Prisma__ChatMessageClient<ChatMessageGetPayload<T>>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ChatMessageFindManyArgs>(
      args?: SelectSubset<T, ChatMessageFindManyArgs>
    ): Prisma.PrismaPromise<Array<ChatMessageGetPayload<T>>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
    **/
    create<T extends ChatMessageCreateArgs>(
      args: SelectSubset<T, ChatMessageCreateArgs>
    ): Prisma__ChatMessageClient<ChatMessageGetPayload<T>>

    /**
     * Create many ChatMessages.
     *     @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     *     @example
     *     // Create many ChatMessages
     *     const chatMessage = await prisma.chatMessage.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ChatMessageCreateManyArgs>(
      args?: SelectSubset<T, ChatMessageCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
    **/
    delete<T extends ChatMessageDeleteArgs>(
      args: SelectSubset<T, ChatMessageDeleteArgs>
    ): Prisma__ChatMessageClient<ChatMessageGetPayload<T>>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ChatMessageUpdateArgs>(
      args: SelectSubset<T, ChatMessageUpdateArgs>
    ): Prisma__ChatMessageClient<ChatMessageGetPayload<T>>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ChatMessageDeleteManyArgs>(
      args?: SelectSubset<T, ChatMessageDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ChatMessageUpdateManyArgs>(
      args: SelectSubset<T, ChatMessageUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
    **/
    upsert<T extends ChatMessageUpsertArgs>(
      args: SelectSubset<T, ChatMessageUpsertArgs>
    ): Prisma__ChatMessageClient<ChatMessageGetPayload<T>>

    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ChatMessageClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ChatMessage base type for findUnique actions
   */
  export type ChatMessageFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUnique
   */
  export interface ChatMessageFindUniqueArgs extends ChatMessageFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }


  /**
   * ChatMessage base type for findFirst actions
   */
  export type ChatMessageFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Enumerable<ChatMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: Enumerable<ChatMessageScalarFieldEnum>
  }

  /**
   * ChatMessage findFirst
   */
  export interface ChatMessageFindFirstArgs extends ChatMessageFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Enumerable<ChatMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: Enumerable<ChatMessageScalarFieldEnum>
  }


  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Enumerable<ChatMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: Enumerable<ChatMessageScalarFieldEnum>
  }


  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }


  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs = {
    /**
     * The data used to create many ChatMessages.
     */
    data: Enumerable<ChatMessageCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }


  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
  }


  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }


  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }


  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
  }


  /**
   * ChatMessage without action
   */
  export type ChatMessageArgs = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect | null
  }



  /**
   * Model ChatMessageEmote
   */


  export type AggregateChatMessageEmote = {
    _count: ChatMessageEmoteCountAggregateOutputType | null
    _avg: ChatMessageEmoteAvgAggregateOutputType | null
    _sum: ChatMessageEmoteSumAggregateOutputType | null
    _min: ChatMessageEmoteMinAggregateOutputType | null
    _max: ChatMessageEmoteMaxAggregateOutputType | null
  }

  export type ChatMessageEmoteAvgAggregateOutputType = {
    startIdx: number | null
    endIdx: number | null
  }

  export type ChatMessageEmoteSumAggregateOutputType = {
    startIdx: number | null
    endIdx: number | null
  }

  export type ChatMessageEmoteMinAggregateOutputType = {
    messageId: string | null
    emoteId: string | null
    emoteSource: string | null
    startIdx: number | null
    endIdx: number | null
  }

  export type ChatMessageEmoteMaxAggregateOutputType = {
    messageId: string | null
    emoteId: string | null
    emoteSource: string | null
    startIdx: number | null
    endIdx: number | null
  }

  export type ChatMessageEmoteCountAggregateOutputType = {
    messageId: number
    emoteId: number
    emoteSource: number
    startIdx: number
    endIdx: number
    _all: number
  }


  export type ChatMessageEmoteAvgAggregateInputType = {
    startIdx?: true
    endIdx?: true
  }

  export type ChatMessageEmoteSumAggregateInputType = {
    startIdx?: true
    endIdx?: true
  }

  export type ChatMessageEmoteMinAggregateInputType = {
    messageId?: true
    emoteId?: true
    emoteSource?: true
    startIdx?: true
    endIdx?: true
  }

  export type ChatMessageEmoteMaxAggregateInputType = {
    messageId?: true
    emoteId?: true
    emoteSource?: true
    startIdx?: true
    endIdx?: true
  }

  export type ChatMessageEmoteCountAggregateInputType = {
    messageId?: true
    emoteId?: true
    emoteSource?: true
    startIdx?: true
    endIdx?: true
    _all?: true
  }

  export type ChatMessageEmoteAggregateArgs = {
    /**
     * Filter which ChatMessageEmote to aggregate.
     */
    where?: ChatMessageEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessageEmotes to fetch.
     */
    orderBy?: Enumerable<ChatMessageEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessageEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessageEmotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessageEmotes
    **/
    _count?: true | ChatMessageEmoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatMessageEmoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatMessageEmoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageEmoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageEmoteMaxAggregateInputType
  }

  export type GetChatMessageEmoteAggregateType<T extends ChatMessageEmoteAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessageEmote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessageEmote[P]>
      : GetScalarType<T[P], AggregateChatMessageEmote[P]>
  }




  export type ChatMessageEmoteGroupByArgs = {
    where?: ChatMessageEmoteWhereInput
    orderBy?: Enumerable<ChatMessageEmoteOrderByWithAggregationInput>
    by: ChatMessageEmoteScalarFieldEnum[]
    having?: ChatMessageEmoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageEmoteCountAggregateInputType | true
    _avg?: ChatMessageEmoteAvgAggregateInputType
    _sum?: ChatMessageEmoteSumAggregateInputType
    _min?: ChatMessageEmoteMinAggregateInputType
    _max?: ChatMessageEmoteMaxAggregateInputType
  }


  export type ChatMessageEmoteGroupByOutputType = {
    messageId: string
    emoteId: string
    emoteSource: string
    startIdx: number
    endIdx: number
    _count: ChatMessageEmoteCountAggregateOutputType | null
    _avg: ChatMessageEmoteAvgAggregateOutputType | null
    _sum: ChatMessageEmoteSumAggregateOutputType | null
    _min: ChatMessageEmoteMinAggregateOutputType | null
    _max: ChatMessageEmoteMaxAggregateOutputType | null
  }

  type GetChatMessageEmoteGroupByPayload<T extends ChatMessageEmoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ChatMessageEmoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageEmoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageEmoteGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageEmoteGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageEmoteSelect = {
    messageId?: boolean
    emoteId?: boolean
    emoteSource?: boolean
    startIdx?: boolean
    endIdx?: boolean
  }


  export type ChatMessageEmoteGetPayload<S extends boolean | null | undefined | ChatMessageEmoteArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? ChatMessageEmote :
    S extends undefined ? never :
    S extends { include: any } & (ChatMessageEmoteArgs | ChatMessageEmoteFindManyArgs)
    ? ChatMessageEmote 
    : S extends { select: any } & (ChatMessageEmoteArgs | ChatMessageEmoteFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof ChatMessageEmote ? ChatMessageEmote[P] : never
  } 
      : ChatMessageEmote


  type ChatMessageEmoteCountArgs = 
    Omit<ChatMessageEmoteFindManyArgs, 'select' | 'include'> & {
      select?: ChatMessageEmoteCountAggregateInputType | true
    }

  export interface ChatMessageEmoteDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one ChatMessageEmote that matches the filter.
     * @param {ChatMessageEmoteFindUniqueArgs} args - Arguments to find a ChatMessageEmote
     * @example
     * // Get one ChatMessageEmote
     * const chatMessageEmote = await prisma.chatMessageEmote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ChatMessageEmoteFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ChatMessageEmoteFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ChatMessageEmote'> extends True ? Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>> : Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T> | null, null>

    /**
     * Find one ChatMessageEmote that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ChatMessageEmoteFindUniqueOrThrowArgs} args - Arguments to find a ChatMessageEmote
     * @example
     * // Get one ChatMessageEmote
     * const chatMessageEmote = await prisma.chatMessageEmote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ChatMessageEmoteFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ChatMessageEmoteFindUniqueOrThrowArgs>
    ): Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>>

    /**
     * Find the first ChatMessageEmote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteFindFirstArgs} args - Arguments to find a ChatMessageEmote
     * @example
     * // Get one ChatMessageEmote
     * const chatMessageEmote = await prisma.chatMessageEmote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ChatMessageEmoteFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ChatMessageEmoteFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ChatMessageEmote'> extends True ? Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>> : Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T> | null, null>

    /**
     * Find the first ChatMessageEmote that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteFindFirstOrThrowArgs} args - Arguments to find a ChatMessageEmote
     * @example
     * // Get one ChatMessageEmote
     * const chatMessageEmote = await prisma.chatMessageEmote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ChatMessageEmoteFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ChatMessageEmoteFindFirstOrThrowArgs>
    ): Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>>

    /**
     * Find zero or more ChatMessageEmotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessageEmotes
     * const chatMessageEmotes = await prisma.chatMessageEmote.findMany()
     * 
     * // Get first 10 ChatMessageEmotes
     * const chatMessageEmotes = await prisma.chatMessageEmote.findMany({ take: 10 })
     * 
     * // Only select the `messageId`
     * const chatMessageEmoteWithMessageIdOnly = await prisma.chatMessageEmote.findMany({ select: { messageId: true } })
     * 
    **/
    findMany<T extends ChatMessageEmoteFindManyArgs>(
      args?: SelectSubset<T, ChatMessageEmoteFindManyArgs>
    ): Prisma.PrismaPromise<Array<ChatMessageEmoteGetPayload<T>>>

    /**
     * Create a ChatMessageEmote.
     * @param {ChatMessageEmoteCreateArgs} args - Arguments to create a ChatMessageEmote.
     * @example
     * // Create one ChatMessageEmote
     * const ChatMessageEmote = await prisma.chatMessageEmote.create({
     *   data: {
     *     // ... data to create a ChatMessageEmote
     *   }
     * })
     * 
    **/
    create<T extends ChatMessageEmoteCreateArgs>(
      args: SelectSubset<T, ChatMessageEmoteCreateArgs>
    ): Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>>

    /**
     * Create many ChatMessageEmotes.
     *     @param {ChatMessageEmoteCreateManyArgs} args - Arguments to create many ChatMessageEmotes.
     *     @example
     *     // Create many ChatMessageEmotes
     *     const chatMessageEmote = await prisma.chatMessageEmote.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ChatMessageEmoteCreateManyArgs>(
      args?: SelectSubset<T, ChatMessageEmoteCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatMessageEmote.
     * @param {ChatMessageEmoteDeleteArgs} args - Arguments to delete one ChatMessageEmote.
     * @example
     * // Delete one ChatMessageEmote
     * const ChatMessageEmote = await prisma.chatMessageEmote.delete({
     *   where: {
     *     // ... filter to delete one ChatMessageEmote
     *   }
     * })
     * 
    **/
    delete<T extends ChatMessageEmoteDeleteArgs>(
      args: SelectSubset<T, ChatMessageEmoteDeleteArgs>
    ): Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>>

    /**
     * Update one ChatMessageEmote.
     * @param {ChatMessageEmoteUpdateArgs} args - Arguments to update one ChatMessageEmote.
     * @example
     * // Update one ChatMessageEmote
     * const chatMessageEmote = await prisma.chatMessageEmote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ChatMessageEmoteUpdateArgs>(
      args: SelectSubset<T, ChatMessageEmoteUpdateArgs>
    ): Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>>

    /**
     * Delete zero or more ChatMessageEmotes.
     * @param {ChatMessageEmoteDeleteManyArgs} args - Arguments to filter ChatMessageEmotes to delete.
     * @example
     * // Delete a few ChatMessageEmotes
     * const { count } = await prisma.chatMessageEmote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ChatMessageEmoteDeleteManyArgs>(
      args?: SelectSubset<T, ChatMessageEmoteDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessageEmotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessageEmotes
     * const chatMessageEmote = await prisma.chatMessageEmote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ChatMessageEmoteUpdateManyArgs>(
      args: SelectSubset<T, ChatMessageEmoteUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMessageEmote.
     * @param {ChatMessageEmoteUpsertArgs} args - Arguments to update or create a ChatMessageEmote.
     * @example
     * // Update or create a ChatMessageEmote
     * const chatMessageEmote = await prisma.chatMessageEmote.upsert({
     *   create: {
     *     // ... data to create a ChatMessageEmote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessageEmote we want to update
     *   }
     * })
    **/
    upsert<T extends ChatMessageEmoteUpsertArgs>(
      args: SelectSubset<T, ChatMessageEmoteUpsertArgs>
    ): Prisma__ChatMessageEmoteClient<ChatMessageEmoteGetPayload<T>>

    /**
     * Count the number of ChatMessageEmotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteCountArgs} args - Arguments to filter ChatMessageEmotes to count.
     * @example
     * // Count the number of ChatMessageEmotes
     * const count = await prisma.chatMessageEmote.count({
     *   where: {
     *     // ... the filter for the ChatMessageEmotes we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageEmoteCountArgs>(
      args?: Subset<T, ChatMessageEmoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageEmoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessageEmote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageEmoteAggregateArgs>(args: Subset<T, ChatMessageEmoteAggregateArgs>): Prisma.PrismaPromise<GetChatMessageEmoteAggregateType<T>>

    /**
     * Group by ChatMessageEmote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageEmoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageEmoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageEmoteGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageEmoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageEmoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageEmoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessageEmote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ChatMessageEmoteClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ChatMessageEmote base type for findUnique actions
   */
  export type ChatMessageEmoteFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * Filter, which ChatMessageEmote to fetch.
     */
    where: ChatMessageEmoteWhereUniqueInput
  }

  /**
   * ChatMessageEmote findUnique
   */
  export interface ChatMessageEmoteFindUniqueArgs extends ChatMessageEmoteFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ChatMessageEmote findUniqueOrThrow
   */
  export type ChatMessageEmoteFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * Filter, which ChatMessageEmote to fetch.
     */
    where: ChatMessageEmoteWhereUniqueInput
  }


  /**
   * ChatMessageEmote base type for findFirst actions
   */
  export type ChatMessageEmoteFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * Filter, which ChatMessageEmote to fetch.
     */
    where?: ChatMessageEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessageEmotes to fetch.
     */
    orderBy?: Enumerable<ChatMessageEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessageEmotes.
     */
    cursor?: ChatMessageEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessageEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessageEmotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessageEmotes.
     */
    distinct?: Enumerable<ChatMessageEmoteScalarFieldEnum>
  }

  /**
   * ChatMessageEmote findFirst
   */
  export interface ChatMessageEmoteFindFirstArgs extends ChatMessageEmoteFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ChatMessageEmote findFirstOrThrow
   */
  export type ChatMessageEmoteFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * Filter, which ChatMessageEmote to fetch.
     */
    where?: ChatMessageEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessageEmotes to fetch.
     */
    orderBy?: Enumerable<ChatMessageEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessageEmotes.
     */
    cursor?: ChatMessageEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessageEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessageEmotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessageEmotes.
     */
    distinct?: Enumerable<ChatMessageEmoteScalarFieldEnum>
  }


  /**
   * ChatMessageEmote findMany
   */
  export type ChatMessageEmoteFindManyArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * Filter, which ChatMessageEmotes to fetch.
     */
    where?: ChatMessageEmoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessageEmotes to fetch.
     */
    orderBy?: Enumerable<ChatMessageEmoteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessageEmotes.
     */
    cursor?: ChatMessageEmoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessageEmotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessageEmotes.
     */
    skip?: number
    distinct?: Enumerable<ChatMessageEmoteScalarFieldEnum>
  }


  /**
   * ChatMessageEmote create
   */
  export type ChatMessageEmoteCreateArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * The data needed to create a ChatMessageEmote.
     */
    data: XOR<ChatMessageEmoteCreateInput, ChatMessageEmoteUncheckedCreateInput>
  }


  /**
   * ChatMessageEmote createMany
   */
  export type ChatMessageEmoteCreateManyArgs = {
    /**
     * The data used to create many ChatMessageEmotes.
     */
    data: Enumerable<ChatMessageEmoteCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ChatMessageEmote update
   */
  export type ChatMessageEmoteUpdateArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * The data needed to update a ChatMessageEmote.
     */
    data: XOR<ChatMessageEmoteUpdateInput, ChatMessageEmoteUncheckedUpdateInput>
    /**
     * Choose, which ChatMessageEmote to update.
     */
    where: ChatMessageEmoteWhereUniqueInput
  }


  /**
   * ChatMessageEmote updateMany
   */
  export type ChatMessageEmoteUpdateManyArgs = {
    /**
     * The data used to update ChatMessageEmotes.
     */
    data: XOR<ChatMessageEmoteUpdateManyMutationInput, ChatMessageEmoteUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessageEmotes to update
     */
    where?: ChatMessageEmoteWhereInput
  }


  /**
   * ChatMessageEmote upsert
   */
  export type ChatMessageEmoteUpsertArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * The filter to search for the ChatMessageEmote to update in case it exists.
     */
    where: ChatMessageEmoteWhereUniqueInput
    /**
     * In case the ChatMessageEmote found by the `where` argument doesn't exist, create a new ChatMessageEmote with this data.
     */
    create: XOR<ChatMessageEmoteCreateInput, ChatMessageEmoteUncheckedCreateInput>
    /**
     * In case the ChatMessageEmote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageEmoteUpdateInput, ChatMessageEmoteUncheckedUpdateInput>
  }


  /**
   * ChatMessageEmote delete
   */
  export type ChatMessageEmoteDeleteArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
    /**
     * Filter which ChatMessageEmote to delete.
     */
    where: ChatMessageEmoteWhereUniqueInput
  }


  /**
   * ChatMessageEmote deleteMany
   */
  export type ChatMessageEmoteDeleteManyArgs = {
    /**
     * Filter which ChatMessageEmotes to delete
     */
    where?: ChatMessageEmoteWhereInput
  }


  /**
   * ChatMessageEmote without action
   */
  export type ChatMessageEmoteArgs = {
    /**
     * Select specific fields to fetch from the ChatMessageEmote
     */
    select?: ChatMessageEmoteSelect | null
  }



  /**
   * Model File
   */


  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    recordingId: number | null
    seq: number | null
    timeOffset: Decimal | null
    duration: Decimal | null
    retries: number | null
    size: number | null
    downloaded: number | null
  }

  export type FileSumAggregateOutputType = {
    recordingId: bigint | null
    seq: number | null
    timeOffset: Decimal | null
    duration: Decimal | null
    retries: number | null
    size: number | null
    downloaded: number | null
  }

  export type FileMinAggregateOutputType = {
    recordingId: bigint | null
    name: string | null
    seq: number | null
    timeOffset: Decimal | null
    duration: Decimal | null
    retries: number | null
    datetime: Date | null
    size: number | null
    downloaded: number | null
    hash: string | null
    status: FileStatus | null
  }

  export type FileMaxAggregateOutputType = {
    recordingId: bigint | null
    name: string | null
    seq: number | null
    timeOffset: Decimal | null
    duration: Decimal | null
    retries: number | null
    datetime: Date | null
    size: number | null
    downloaded: number | null
    hash: string | null
    status: FileStatus | null
  }

  export type FileCountAggregateOutputType = {
    recordingId: number
    name: number
    seq: number
    timeOffset: number
    duration: number
    retries: number
    datetime: number
    size: number
    downloaded: number
    hash: number
    status: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    recordingId?: true
    seq?: true
    timeOffset?: true
    duration?: true
    retries?: true
    size?: true
    downloaded?: true
  }

  export type FileSumAggregateInputType = {
    recordingId?: true
    seq?: true
    timeOffset?: true
    duration?: true
    retries?: true
    size?: true
    downloaded?: true
  }

  export type FileMinAggregateInputType = {
    recordingId?: true
    name?: true
    seq?: true
    timeOffset?: true
    duration?: true
    retries?: true
    datetime?: true
    size?: true
    downloaded?: true
    hash?: true
    status?: true
  }

  export type FileMaxAggregateInputType = {
    recordingId?: true
    name?: true
    seq?: true
    timeOffset?: true
    duration?: true
    retries?: true
    datetime?: true
    size?: true
    downloaded?: true
    hash?: true
    status?: true
  }

  export type FileCountAggregateInputType = {
    recordingId?: true
    name?: true
    seq?: true
    timeOffset?: true
    duration?: true
    retries?: true
    datetime?: true
    size?: true
    downloaded?: true
    hash?: true
    status?: true
    _all?: true
  }

  export type FileAggregateArgs = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: Enumerable<FileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs = {
    where?: FileWhereInput
    orderBy?: Enumerable<FileOrderByWithAggregationInput>
    by: FileScalarFieldEnum[]
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }


  export type FileGroupByOutputType = {
    recordingId: bigint
    name: string
    seq: number
    timeOffset: Decimal
    duration: Decimal
    retries: number
    datetime: Date
    size: number
    downloaded: number
    hash: string
    status: FileStatus | null
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect = {
    recordingId?: boolean
    name?: boolean
    seq?: boolean
    timeOffset?: boolean
    duration?: boolean
    retries?: boolean
    datetime?: boolean
    size?: boolean
    downloaded?: boolean
    hash?: boolean
    status?: boolean
  }


  export type FileGetPayload<S extends boolean | null | undefined | FileArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? File :
    S extends undefined ? never :
    S extends { include: any } & (FileArgs | FileFindManyArgs)
    ? File 
    : S extends { select: any } & (FileArgs | FileFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof File ? File[P] : never
  } 
      : File


  type FileCountArgs = 
    Omit<FileFindManyArgs, 'select' | 'include'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FileFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, FileFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'File'> extends True ? Prisma__FileClient<FileGetPayload<T>> : Prisma__FileClient<FileGetPayload<T> | null, null>

    /**
     * Find one File that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, FileFindUniqueOrThrowArgs>
    ): Prisma__FileClient<FileGetPayload<T>>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FileFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, FileFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'File'> extends True ? Prisma__FileClient<FileGetPayload<T>> : Prisma__FileClient<FileGetPayload<T> | null, null>

    /**
     * Find the first File that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs>(
      args?: SelectSubset<T, FileFindFirstOrThrowArgs>
    ): Prisma__FileClient<FileGetPayload<T>>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `recordingId`
     * const fileWithRecordingIdOnly = await prisma.file.findMany({ select: { recordingId: true } })
     * 
    **/
    findMany<T extends FileFindManyArgs>(
      args?: SelectSubset<T, FileFindManyArgs>
    ): Prisma.PrismaPromise<Array<FileGetPayload<T>>>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
    **/
    create<T extends FileCreateArgs>(
      args: SelectSubset<T, FileCreateArgs>
    ): Prisma__FileClient<FileGetPayload<T>>

    /**
     * Create many Files.
     *     @param {FileCreateManyArgs} args - Arguments to create many Files.
     *     @example
     *     // Create many Files
     *     const file = await prisma.file.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FileCreateManyArgs>(
      args?: SelectSubset<T, FileCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
    **/
    delete<T extends FileDeleteArgs>(
      args: SelectSubset<T, FileDeleteArgs>
    ): Prisma__FileClient<FileGetPayload<T>>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FileUpdateArgs>(
      args: SelectSubset<T, FileUpdateArgs>
    ): Prisma__FileClient<FileGetPayload<T>>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FileDeleteManyArgs>(
      args?: SelectSubset<T, FileDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FileUpdateManyArgs>(
      args: SelectSubset<T, FileUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
    **/
    upsert<T extends FileUpsertArgs>(
      args: SelectSubset<T, FileUpsertArgs>
    ): Prisma__FileClient<FileGetPayload<T>>

    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__FileClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * File base type for findUnique actions
   */
  export type FileFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findUnique
   */
  export interface FileFindUniqueArgs extends FileFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File base type for findFirst actions
   */
  export type FileFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: Enumerable<FileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: Enumerable<FileScalarFieldEnum>
  }

  /**
   * File findFirst
   */
  export interface FileFindFirstArgs extends FileFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: Enumerable<FileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: Enumerable<FileScalarFieldEnum>
  }


  /**
   * File findMany
   */
  export type FileFindManyArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: Enumerable<FileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: Enumerable<FileScalarFieldEnum>
  }


  /**
   * File create
   */
  export type FileCreateArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }


  /**
   * File createMany
   */
  export type FileCreateManyArgs = {
    /**
     * The data used to create many Files.
     */
    data: Enumerable<FileCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * File update
   */
  export type FileUpdateArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File updateMany
   */
  export type FileUpdateManyArgs = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
  }


  /**
   * File upsert
   */
  export type FileUpsertArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }


  /**
   * File delete
   */
  export type FileDeleteArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
  }


  /**
   * File without action
   */
  export type FileArgs = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect | null
  }



  /**
   * Model Recording
   */


  export type AggregateRecording = {
    _count: RecordingCountAggregateOutputType | null
    _avg: RecordingAvgAggregateOutputType | null
    _sum: RecordingSumAggregateOutputType | null
    _min: RecordingMinAggregateOutputType | null
    _max: RecordingMaxAggregateOutputType | null
  }

  export type RecordingAvgAggregateOutputType = {
    id: number | null
  }

  export type RecordingSumAggregateOutputType = {
    id: bigint | null
  }

  export type RecordingMinAggregateOutputType = {
    id: bigint | null
    start: Date | null
    stop: Date | null
    channel: string | null
    site_id: string | null
  }

  export type RecordingMaxAggregateOutputType = {
    id: bigint | null
    start: Date | null
    stop: Date | null
    channel: string | null
    site_id: string | null
  }

  export type RecordingCountAggregateOutputType = {
    id: number
    start: number
    stop: number
    channel: number
    site_id: number
    data: number
    _all: number
  }


  export type RecordingAvgAggregateInputType = {
    id?: true
  }

  export type RecordingSumAggregateInputType = {
    id?: true
  }

  export type RecordingMinAggregateInputType = {
    id?: true
    start?: true
    stop?: true
    channel?: true
    site_id?: true
  }

  export type RecordingMaxAggregateInputType = {
    id?: true
    start?: true
    stop?: true
    channel?: true
    site_id?: true
  }

  export type RecordingCountAggregateInputType = {
    id?: true
    start?: true
    stop?: true
    channel?: true
    site_id?: true
    data?: true
    _all?: true
  }

  export type RecordingAggregateArgs = {
    /**
     * Filter which Recording to aggregate.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: Enumerable<RecordingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recordings
    **/
    _count?: true | RecordingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecordingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecordingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecordingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecordingMaxAggregateInputType
  }

  export type GetRecordingAggregateType<T extends RecordingAggregateArgs> = {
        [P in keyof T & keyof AggregateRecording]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecording[P]>
      : GetScalarType<T[P], AggregateRecording[P]>
  }




  export type RecordingGroupByArgs = {
    where?: RecordingWhereInput
    orderBy?: Enumerable<RecordingOrderByWithAggregationInput>
    by: RecordingScalarFieldEnum[]
    having?: RecordingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecordingCountAggregateInputType | true
    _avg?: RecordingAvgAggregateInputType
    _sum?: RecordingSumAggregateInputType
    _min?: RecordingMinAggregateInputType
    _max?: RecordingMaxAggregateInputType
  }


  export type RecordingGroupByOutputType = {
    id: bigint
    start: Date
    stop: Date | null
    channel: string
    site_id: string
    data: JsonValue | null
    _count: RecordingCountAggregateOutputType | null
    _avg: RecordingAvgAggregateOutputType | null
    _sum: RecordingSumAggregateOutputType | null
    _min: RecordingMinAggregateOutputType | null
    _max: RecordingMaxAggregateOutputType | null
  }

  type GetRecordingGroupByPayload<T extends RecordingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<RecordingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecordingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecordingGroupByOutputType[P]>
            : GetScalarType<T[P], RecordingGroupByOutputType[P]>
        }
      >
    >


  export type RecordingSelect = {
    id?: boolean
    start?: boolean
    stop?: boolean
    channel?: boolean
    site_id?: boolean
    data?: boolean
  }


  export type RecordingGetPayload<S extends boolean | null | undefined | RecordingArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Recording :
    S extends undefined ? never :
    S extends { include: any } & (RecordingArgs | RecordingFindManyArgs)
    ? Recording 
    : S extends { select: any } & (RecordingArgs | RecordingFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Recording ? Recording[P] : never
  } 
      : Recording


  type RecordingCountArgs = 
    Omit<RecordingFindManyArgs, 'select' | 'include'> & {
      select?: RecordingCountAggregateInputType | true
    }

  export interface RecordingDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Recording that matches the filter.
     * @param {RecordingFindUniqueArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends RecordingFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, RecordingFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Recording'> extends True ? Prisma__RecordingClient<RecordingGetPayload<T>> : Prisma__RecordingClient<RecordingGetPayload<T> | null, null>

    /**
     * Find one Recording that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {RecordingFindUniqueOrThrowArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends RecordingFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, RecordingFindUniqueOrThrowArgs>
    ): Prisma__RecordingClient<RecordingGetPayload<T>>

    /**
     * Find the first Recording that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingFindFirstArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends RecordingFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, RecordingFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Recording'> extends True ? Prisma__RecordingClient<RecordingGetPayload<T>> : Prisma__RecordingClient<RecordingGetPayload<T> | null, null>

    /**
     * Find the first Recording that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingFindFirstOrThrowArgs} args - Arguments to find a Recording
     * @example
     * // Get one Recording
     * const recording = await prisma.recording.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends RecordingFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RecordingFindFirstOrThrowArgs>
    ): Prisma__RecordingClient<RecordingGetPayload<T>>

    /**
     * Find zero or more Recordings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recordings
     * const recordings = await prisma.recording.findMany()
     * 
     * // Get first 10 Recordings
     * const recordings = await prisma.recording.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recordingWithIdOnly = await prisma.recording.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends RecordingFindManyArgs>(
      args?: SelectSubset<T, RecordingFindManyArgs>
    ): Prisma.PrismaPromise<Array<RecordingGetPayload<T>>>

    /**
     * Create a Recording.
     * @param {RecordingCreateArgs} args - Arguments to create a Recording.
     * @example
     * // Create one Recording
     * const Recording = await prisma.recording.create({
     *   data: {
     *     // ... data to create a Recording
     *   }
     * })
     * 
    **/
    create<T extends RecordingCreateArgs>(
      args: SelectSubset<T, RecordingCreateArgs>
    ): Prisma__RecordingClient<RecordingGetPayload<T>>

    /**
     * Create many Recordings.
     *     @param {RecordingCreateManyArgs} args - Arguments to create many Recordings.
     *     @example
     *     // Create many Recordings
     *     const recording = await prisma.recording.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends RecordingCreateManyArgs>(
      args?: SelectSubset<T, RecordingCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Recording.
     * @param {RecordingDeleteArgs} args - Arguments to delete one Recording.
     * @example
     * // Delete one Recording
     * const Recording = await prisma.recording.delete({
     *   where: {
     *     // ... filter to delete one Recording
     *   }
     * })
     * 
    **/
    delete<T extends RecordingDeleteArgs>(
      args: SelectSubset<T, RecordingDeleteArgs>
    ): Prisma__RecordingClient<RecordingGetPayload<T>>

    /**
     * Update one Recording.
     * @param {RecordingUpdateArgs} args - Arguments to update one Recording.
     * @example
     * // Update one Recording
     * const recording = await prisma.recording.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends RecordingUpdateArgs>(
      args: SelectSubset<T, RecordingUpdateArgs>
    ): Prisma__RecordingClient<RecordingGetPayload<T>>

    /**
     * Delete zero or more Recordings.
     * @param {RecordingDeleteManyArgs} args - Arguments to filter Recordings to delete.
     * @example
     * // Delete a few Recordings
     * const { count } = await prisma.recording.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends RecordingDeleteManyArgs>(
      args?: SelectSubset<T, RecordingDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recordings
     * const recording = await prisma.recording.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends RecordingUpdateManyArgs>(
      args: SelectSubset<T, RecordingUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Recording.
     * @param {RecordingUpsertArgs} args - Arguments to update or create a Recording.
     * @example
     * // Update or create a Recording
     * const recording = await prisma.recording.upsert({
     *   create: {
     *     // ... data to create a Recording
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recording we want to update
     *   }
     * })
    **/
    upsert<T extends RecordingUpsertArgs>(
      args: SelectSubset<T, RecordingUpsertArgs>
    ): Prisma__RecordingClient<RecordingGetPayload<T>>

    /**
     * Count the number of Recordings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingCountArgs} args - Arguments to filter Recordings to count.
     * @example
     * // Count the number of Recordings
     * const count = await prisma.recording.count({
     *   where: {
     *     // ... the filter for the Recordings we want to count
     *   }
     * })
    **/
    count<T extends RecordingCountArgs>(
      args?: Subset<T, RecordingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecordingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recording.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecordingAggregateArgs>(args: Subset<T, RecordingAggregateArgs>): Prisma.PrismaPromise<GetRecordingAggregateType<T>>

    /**
     * Group by Recording.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecordingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecordingGroupByArgs['orderBy'] }
        : { orderBy?: RecordingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecordingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecordingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Recording.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__RecordingClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Recording base type for findUnique actions
   */
  export type RecordingFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * Filter, which Recording to fetch.
     */
    where: RecordingWhereUniqueInput
  }

  /**
   * Recording findUnique
   */
  export interface RecordingFindUniqueArgs extends RecordingFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Recording findUniqueOrThrow
   */
  export type RecordingFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * Filter, which Recording to fetch.
     */
    where: RecordingWhereUniqueInput
  }


  /**
   * Recording base type for findFirst actions
   */
  export type RecordingFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * Filter, which Recording to fetch.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: Enumerable<RecordingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recordings.
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recordings.
     */
    distinct?: Enumerable<RecordingScalarFieldEnum>
  }

  /**
   * Recording findFirst
   */
  export interface RecordingFindFirstArgs extends RecordingFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Recording findFirstOrThrow
   */
  export type RecordingFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * Filter, which Recording to fetch.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: Enumerable<RecordingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recordings.
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recordings.
     */
    distinct?: Enumerable<RecordingScalarFieldEnum>
  }


  /**
   * Recording findMany
   */
  export type RecordingFindManyArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * Filter, which Recordings to fetch.
     */
    where?: RecordingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recordings to fetch.
     */
    orderBy?: Enumerable<RecordingOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recordings.
     */
    cursor?: RecordingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recordings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recordings.
     */
    skip?: number
    distinct?: Enumerable<RecordingScalarFieldEnum>
  }


  /**
   * Recording create
   */
  export type RecordingCreateArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * The data needed to create a Recording.
     */
    data: XOR<RecordingCreateInput, RecordingUncheckedCreateInput>
  }


  /**
   * Recording createMany
   */
  export type RecordingCreateManyArgs = {
    /**
     * The data used to create many Recordings.
     */
    data: Enumerable<RecordingCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Recording update
   */
  export type RecordingUpdateArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * The data needed to update a Recording.
     */
    data: XOR<RecordingUpdateInput, RecordingUncheckedUpdateInput>
    /**
     * Choose, which Recording to update.
     */
    where: RecordingWhereUniqueInput
  }


  /**
   * Recording updateMany
   */
  export type RecordingUpdateManyArgs = {
    /**
     * The data used to update Recordings.
     */
    data: XOR<RecordingUpdateManyMutationInput, RecordingUncheckedUpdateManyInput>
    /**
     * Filter which Recordings to update
     */
    where?: RecordingWhereInput
  }


  /**
   * Recording upsert
   */
  export type RecordingUpsertArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * The filter to search for the Recording to update in case it exists.
     */
    where: RecordingWhereUniqueInput
    /**
     * In case the Recording found by the `where` argument doesn't exist, create a new Recording with this data.
     */
    create: XOR<RecordingCreateInput, RecordingUncheckedCreateInput>
    /**
     * In case the Recording was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecordingUpdateInput, RecordingUncheckedUpdateInput>
  }


  /**
   * Recording delete
   */
  export type RecordingDeleteArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
    /**
     * Filter which Recording to delete.
     */
    where: RecordingWhereUniqueInput
  }


  /**
   * Recording deleteMany
   */
  export type RecordingDeleteManyArgs = {
    /**
     * Filter which Recordings to delete
     */
    where?: RecordingWhereInput
  }


  /**
   * Recording without action
   */
  export type RecordingArgs = {
    /**
     * Select specific fields to fetch from the Recording
     */
    select?: RecordingSelect | null
  }



  /**
   * Model Storyboard
   */


  export type AggregateStoryboard = {
    _count: StoryboardCountAggregateOutputType | null
    _avg: StoryboardAvgAggregateOutputType | null
    _sum: StoryboardSumAggregateOutputType | null
    _min: StoryboardMinAggregateOutputType | null
    _max: StoryboardMaxAggregateOutputType | null
  }

  export type StoryboardAvgAggregateOutputType = {
    recordingId: number | null
    index: number | null
    firstSequence: number | null
    timeOffset: Decimal | null
    interval: number | null
    rows: number | null
    columns: number | null
  }

  export type StoryboardSumAggregateOutputType = {
    recordingId: bigint | null
    index: number | null
    firstSequence: number | null
    timeOffset: Decimal | null
    interval: number | null
    rows: number | null
    columns: number | null
  }

  export type StoryboardMinAggregateOutputType = {
    recordingId: bigint | null
    index: number | null
    firstSequence: number | null
    timeOffset: Decimal | null
    interval: number | null
    rows: number | null
    columns: number | null
    slug: string | null
  }

  export type StoryboardMaxAggregateOutputType = {
    recordingId: bigint | null
    index: number | null
    firstSequence: number | null
    timeOffset: Decimal | null
    interval: number | null
    rows: number | null
    columns: number | null
    slug: string | null
  }

  export type StoryboardCountAggregateOutputType = {
    recordingId: number
    index: number
    firstSequence: number
    timeOffset: number
    interval: number
    rows: number
    columns: number
    slug: number
    data: number
    _all: number
  }


  export type StoryboardAvgAggregateInputType = {
    recordingId?: true
    index?: true
    firstSequence?: true
    timeOffset?: true
    interval?: true
    rows?: true
    columns?: true
  }

  export type StoryboardSumAggregateInputType = {
    recordingId?: true
    index?: true
    firstSequence?: true
    timeOffset?: true
    interval?: true
    rows?: true
    columns?: true
  }

  export type StoryboardMinAggregateInputType = {
    recordingId?: true
    index?: true
    firstSequence?: true
    timeOffset?: true
    interval?: true
    rows?: true
    columns?: true
    slug?: true
  }

  export type StoryboardMaxAggregateInputType = {
    recordingId?: true
    index?: true
    firstSequence?: true
    timeOffset?: true
    interval?: true
    rows?: true
    columns?: true
    slug?: true
  }

  export type StoryboardCountAggregateInputType = {
    recordingId?: true
    index?: true
    firstSequence?: true
    timeOffset?: true
    interval?: true
    rows?: true
    columns?: true
    slug?: true
    data?: true
    _all?: true
  }

  export type StoryboardAggregateArgs = {
    /**
     * Filter which Storyboard to aggregate.
     */
    where?: StoryboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Storyboards to fetch.
     */
    orderBy?: Enumerable<StoryboardOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoryboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Storyboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Storyboards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Storyboards
    **/
    _count?: true | StoryboardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoryboardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoryboardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoryboardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoryboardMaxAggregateInputType
  }

  export type GetStoryboardAggregateType<T extends StoryboardAggregateArgs> = {
        [P in keyof T & keyof AggregateStoryboard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoryboard[P]>
      : GetScalarType<T[P], AggregateStoryboard[P]>
  }




  export type StoryboardGroupByArgs = {
    where?: StoryboardWhereInput
    orderBy?: Enumerable<StoryboardOrderByWithAggregationInput>
    by: StoryboardScalarFieldEnum[]
    having?: StoryboardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoryboardCountAggregateInputType | true
    _avg?: StoryboardAvgAggregateInputType
    _sum?: StoryboardSumAggregateInputType
    _min?: StoryboardMinAggregateInputType
    _max?: StoryboardMaxAggregateInputType
  }


  export type StoryboardGroupByOutputType = {
    recordingId: bigint
    index: number
    firstSequence: number
    timeOffset: Decimal
    interval: number
    rows: number
    columns: number
    slug: string
    data: JsonValue
    _count: StoryboardCountAggregateOutputType | null
    _avg: StoryboardAvgAggregateOutputType | null
    _sum: StoryboardSumAggregateOutputType | null
    _min: StoryboardMinAggregateOutputType | null
    _max: StoryboardMaxAggregateOutputType | null
  }

  type GetStoryboardGroupByPayload<T extends StoryboardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<StoryboardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoryboardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoryboardGroupByOutputType[P]>
            : GetScalarType<T[P], StoryboardGroupByOutputType[P]>
        }
      >
    >


  export type StoryboardSelect = {
    recordingId?: boolean
    index?: boolean
    firstSequence?: boolean
    timeOffset?: boolean
    interval?: boolean
    rows?: boolean
    columns?: boolean
    slug?: boolean
    data?: boolean
  }


  export type StoryboardGetPayload<S extends boolean | null | undefined | StoryboardArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Storyboard :
    S extends undefined ? never :
    S extends { include: any } & (StoryboardArgs | StoryboardFindManyArgs)
    ? Storyboard 
    : S extends { select: any } & (StoryboardArgs | StoryboardFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Storyboard ? Storyboard[P] : never
  } 
      : Storyboard


  type StoryboardCountArgs = 
    Omit<StoryboardFindManyArgs, 'select' | 'include'> & {
      select?: StoryboardCountAggregateInputType | true
    }

  export interface StoryboardDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Storyboard that matches the filter.
     * @param {StoryboardFindUniqueArgs} args - Arguments to find a Storyboard
     * @example
     * // Get one Storyboard
     * const storyboard = await prisma.storyboard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends StoryboardFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, StoryboardFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Storyboard'> extends True ? Prisma__StoryboardClient<StoryboardGetPayload<T>> : Prisma__StoryboardClient<StoryboardGetPayload<T> | null, null>

    /**
     * Find one Storyboard that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {StoryboardFindUniqueOrThrowArgs} args - Arguments to find a Storyboard
     * @example
     * // Get one Storyboard
     * const storyboard = await prisma.storyboard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends StoryboardFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, StoryboardFindUniqueOrThrowArgs>
    ): Prisma__StoryboardClient<StoryboardGetPayload<T>>

    /**
     * Find the first Storyboard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardFindFirstArgs} args - Arguments to find a Storyboard
     * @example
     * // Get one Storyboard
     * const storyboard = await prisma.storyboard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends StoryboardFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, StoryboardFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Storyboard'> extends True ? Prisma__StoryboardClient<StoryboardGetPayload<T>> : Prisma__StoryboardClient<StoryboardGetPayload<T> | null, null>

    /**
     * Find the first Storyboard that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardFindFirstOrThrowArgs} args - Arguments to find a Storyboard
     * @example
     * // Get one Storyboard
     * const storyboard = await prisma.storyboard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends StoryboardFindFirstOrThrowArgs>(
      args?: SelectSubset<T, StoryboardFindFirstOrThrowArgs>
    ): Prisma__StoryboardClient<StoryboardGetPayload<T>>

    /**
     * Find zero or more Storyboards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Storyboards
     * const storyboards = await prisma.storyboard.findMany()
     * 
     * // Get first 10 Storyboards
     * const storyboards = await prisma.storyboard.findMany({ take: 10 })
     * 
     * // Only select the `recordingId`
     * const storyboardWithRecordingIdOnly = await prisma.storyboard.findMany({ select: { recordingId: true } })
     * 
    **/
    findMany<T extends StoryboardFindManyArgs>(
      args?: SelectSubset<T, StoryboardFindManyArgs>
    ): Prisma.PrismaPromise<Array<StoryboardGetPayload<T>>>

    /**
     * Create a Storyboard.
     * @param {StoryboardCreateArgs} args - Arguments to create a Storyboard.
     * @example
     * // Create one Storyboard
     * const Storyboard = await prisma.storyboard.create({
     *   data: {
     *     // ... data to create a Storyboard
     *   }
     * })
     * 
    **/
    create<T extends StoryboardCreateArgs>(
      args: SelectSubset<T, StoryboardCreateArgs>
    ): Prisma__StoryboardClient<StoryboardGetPayload<T>>

    /**
     * Create many Storyboards.
     *     @param {StoryboardCreateManyArgs} args - Arguments to create many Storyboards.
     *     @example
     *     // Create many Storyboards
     *     const storyboard = await prisma.storyboard.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends StoryboardCreateManyArgs>(
      args?: SelectSubset<T, StoryboardCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Storyboard.
     * @param {StoryboardDeleteArgs} args - Arguments to delete one Storyboard.
     * @example
     * // Delete one Storyboard
     * const Storyboard = await prisma.storyboard.delete({
     *   where: {
     *     // ... filter to delete one Storyboard
     *   }
     * })
     * 
    **/
    delete<T extends StoryboardDeleteArgs>(
      args: SelectSubset<T, StoryboardDeleteArgs>
    ): Prisma__StoryboardClient<StoryboardGetPayload<T>>

    /**
     * Update one Storyboard.
     * @param {StoryboardUpdateArgs} args - Arguments to update one Storyboard.
     * @example
     * // Update one Storyboard
     * const storyboard = await prisma.storyboard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends StoryboardUpdateArgs>(
      args: SelectSubset<T, StoryboardUpdateArgs>
    ): Prisma__StoryboardClient<StoryboardGetPayload<T>>

    /**
     * Delete zero or more Storyboards.
     * @param {StoryboardDeleteManyArgs} args - Arguments to filter Storyboards to delete.
     * @example
     * // Delete a few Storyboards
     * const { count } = await prisma.storyboard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends StoryboardDeleteManyArgs>(
      args?: SelectSubset<T, StoryboardDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Storyboards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Storyboards
     * const storyboard = await prisma.storyboard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends StoryboardUpdateManyArgs>(
      args: SelectSubset<T, StoryboardUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Storyboard.
     * @param {StoryboardUpsertArgs} args - Arguments to update or create a Storyboard.
     * @example
     * // Update or create a Storyboard
     * const storyboard = await prisma.storyboard.upsert({
     *   create: {
     *     // ... data to create a Storyboard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Storyboard we want to update
     *   }
     * })
    **/
    upsert<T extends StoryboardUpsertArgs>(
      args: SelectSubset<T, StoryboardUpsertArgs>
    ): Prisma__StoryboardClient<StoryboardGetPayload<T>>

    /**
     * Count the number of Storyboards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardCountArgs} args - Arguments to filter Storyboards to count.
     * @example
     * // Count the number of Storyboards
     * const count = await prisma.storyboard.count({
     *   where: {
     *     // ... the filter for the Storyboards we want to count
     *   }
     * })
    **/
    count<T extends StoryboardCountArgs>(
      args?: Subset<T, StoryboardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoryboardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Storyboard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoryboardAggregateArgs>(args: Subset<T, StoryboardAggregateArgs>): Prisma.PrismaPromise<GetStoryboardAggregateType<T>>

    /**
     * Group by Storyboard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryboardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoryboardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoryboardGroupByArgs['orderBy'] }
        : { orderBy?: StoryboardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoryboardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoryboardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Storyboard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__StoryboardClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Storyboard base type for findUnique actions
   */
  export type StoryboardFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * Filter, which Storyboard to fetch.
     */
    where: StoryboardWhereUniqueInput
  }

  /**
   * Storyboard findUnique
   */
  export interface StoryboardFindUniqueArgs extends StoryboardFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Storyboard findUniqueOrThrow
   */
  export type StoryboardFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * Filter, which Storyboard to fetch.
     */
    where: StoryboardWhereUniqueInput
  }


  /**
   * Storyboard base type for findFirst actions
   */
  export type StoryboardFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * Filter, which Storyboard to fetch.
     */
    where?: StoryboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Storyboards to fetch.
     */
    orderBy?: Enumerable<StoryboardOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Storyboards.
     */
    cursor?: StoryboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Storyboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Storyboards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Storyboards.
     */
    distinct?: Enumerable<StoryboardScalarFieldEnum>
  }

  /**
   * Storyboard findFirst
   */
  export interface StoryboardFindFirstArgs extends StoryboardFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Storyboard findFirstOrThrow
   */
  export type StoryboardFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * Filter, which Storyboard to fetch.
     */
    where?: StoryboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Storyboards to fetch.
     */
    orderBy?: Enumerable<StoryboardOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Storyboards.
     */
    cursor?: StoryboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Storyboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Storyboards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Storyboards.
     */
    distinct?: Enumerable<StoryboardScalarFieldEnum>
  }


  /**
   * Storyboard findMany
   */
  export type StoryboardFindManyArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * Filter, which Storyboards to fetch.
     */
    where?: StoryboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Storyboards to fetch.
     */
    orderBy?: Enumerable<StoryboardOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Storyboards.
     */
    cursor?: StoryboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Storyboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Storyboards.
     */
    skip?: number
    distinct?: Enumerable<StoryboardScalarFieldEnum>
  }


  /**
   * Storyboard create
   */
  export type StoryboardCreateArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * The data needed to create a Storyboard.
     */
    data: XOR<StoryboardCreateInput, StoryboardUncheckedCreateInput>
  }


  /**
   * Storyboard createMany
   */
  export type StoryboardCreateManyArgs = {
    /**
     * The data used to create many Storyboards.
     */
    data: Enumerable<StoryboardCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Storyboard update
   */
  export type StoryboardUpdateArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * The data needed to update a Storyboard.
     */
    data: XOR<StoryboardUpdateInput, StoryboardUncheckedUpdateInput>
    /**
     * Choose, which Storyboard to update.
     */
    where: StoryboardWhereUniqueInput
  }


  /**
   * Storyboard updateMany
   */
  export type StoryboardUpdateManyArgs = {
    /**
     * The data used to update Storyboards.
     */
    data: XOR<StoryboardUpdateManyMutationInput, StoryboardUncheckedUpdateManyInput>
    /**
     * Filter which Storyboards to update
     */
    where?: StoryboardWhereInput
  }


  /**
   * Storyboard upsert
   */
  export type StoryboardUpsertArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * The filter to search for the Storyboard to update in case it exists.
     */
    where: StoryboardWhereUniqueInput
    /**
     * In case the Storyboard found by the `where` argument doesn't exist, create a new Storyboard with this data.
     */
    create: XOR<StoryboardCreateInput, StoryboardUncheckedCreateInput>
    /**
     * In case the Storyboard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoryboardUpdateInput, StoryboardUncheckedUpdateInput>
  }


  /**
   * Storyboard delete
   */
  export type StoryboardDeleteArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
    /**
     * Filter which Storyboard to delete.
     */
    where: StoryboardWhereUniqueInput
  }


  /**
   * Storyboard deleteMany
   */
  export type StoryboardDeleteManyArgs = {
    /**
     * Filter which Storyboards to delete
     */
    where?: StoryboardWhereInput
  }


  /**
   * Storyboard without action
   */
  export type StoryboardArgs = {
    /**
     * Select specific fields to fetch from the Storyboard
     */
    select?: StoryboardSelect | null
  }



  /**
   * Model Transcript
   */


  export type AggregateTranscript = {
    _count: TranscriptCountAggregateOutputType | null
    _avg: TranscriptAvgAggregateOutputType | null
    _sum: TranscriptSumAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  export type TranscriptAvgAggregateOutputType = {
    id: number | null
    recordingId: number | null
    totalStart: number | null
    totalEnd: number | null
    segmentSequence: number | null
    audiostart: number | null
    audioEnd: number | null
    confidence: number | null
  }

  export type TranscriptSumAggregateOutputType = {
    id: bigint | null
    recordingId: bigint | null
    totalStart: number | null
    totalEnd: number | null
    segmentSequence: number | null
    audiostart: number | null
    audioEnd: number | null
    confidence: number | null
  }

  export type TranscriptMinAggregateOutputType = {
    id: bigint | null
    recordingId: bigint | null
    transcript: string | null
    totalStart: number | null
    totalEnd: number | null
    segmentSequence: number | null
    audiostart: number | null
    audioEnd: number | null
    confidence: number | null
    created: Date | null
  }

  export type TranscriptMaxAggregateOutputType = {
    id: bigint | null
    recordingId: bigint | null
    transcript: string | null
    totalStart: number | null
    totalEnd: number | null
    segmentSequence: number | null
    audiostart: number | null
    audioEnd: number | null
    confidence: number | null
    created: Date | null
  }

  export type TranscriptCountAggregateOutputType = {
    id: number
    recordingId: number
    transcript: number
    totalStart: number
    totalEnd: number
    segmentSequence: number
    audiostart: number
    audioEnd: number
    confidence: number
    created: number
    words: number
    _all: number
  }


  export type TranscriptAvgAggregateInputType = {
    id?: true
    recordingId?: true
    totalStart?: true
    totalEnd?: true
    segmentSequence?: true
    audiostart?: true
    audioEnd?: true
    confidence?: true
  }

  export type TranscriptSumAggregateInputType = {
    id?: true
    recordingId?: true
    totalStart?: true
    totalEnd?: true
    segmentSequence?: true
    audiostart?: true
    audioEnd?: true
    confidence?: true
  }

  export type TranscriptMinAggregateInputType = {
    id?: true
    recordingId?: true
    transcript?: true
    totalStart?: true
    totalEnd?: true
    segmentSequence?: true
    audiostart?: true
    audioEnd?: true
    confidence?: true
    created?: true
  }

  export type TranscriptMaxAggregateInputType = {
    id?: true
    recordingId?: true
    transcript?: true
    totalStart?: true
    totalEnd?: true
    segmentSequence?: true
    audiostart?: true
    audioEnd?: true
    confidence?: true
    created?: true
  }

  export type TranscriptCountAggregateInputType = {
    id?: true
    recordingId?: true
    transcript?: true
    totalStart?: true
    totalEnd?: true
    segmentSequence?: true
    audiostart?: true
    audioEnd?: true
    confidence?: true
    created?: true
    words?: true
    _all?: true
  }

  export type TranscriptAggregateArgs = {
    /**
     * Filter which Transcript to aggregate.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: Enumerable<TranscriptOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transcripts
    **/
    _count?: true | TranscriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TranscriptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TranscriptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptMaxAggregateInputType
  }

  export type GetTranscriptAggregateType<T extends TranscriptAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscript[P]>
      : GetScalarType<T[P], AggregateTranscript[P]>
  }




  export type TranscriptGroupByArgs = {
    where?: TranscriptWhereInput
    orderBy?: Enumerable<TranscriptOrderByWithAggregationInput>
    by: TranscriptScalarFieldEnum[]
    having?: TranscriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptCountAggregateInputType | true
    _avg?: TranscriptAvgAggregateInputType
    _sum?: TranscriptSumAggregateInputType
    _min?: TranscriptMinAggregateInputType
    _max?: TranscriptMaxAggregateInputType
  }


  export type TranscriptGroupByOutputType = {
    id: bigint
    recordingId: bigint
    transcript: string
    totalStart: number
    totalEnd: number
    segmentSequence: number
    audiostart: number
    audioEnd: number
    confidence: number
    created: Date
    words: JsonValue
    _count: TranscriptCountAggregateOutputType | null
    _avg: TranscriptAvgAggregateOutputType | null
    _sum: TranscriptSumAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  type GetTranscriptGroupByPayload<T extends TranscriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TranscriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSelect = {
    id?: boolean
    recordingId?: boolean
    transcript?: boolean
    totalStart?: boolean
    totalEnd?: boolean
    segmentSequence?: boolean
    audiostart?: boolean
    audioEnd?: boolean
    confidence?: boolean
    created?: boolean
    words?: boolean
  }


  export type TranscriptGetPayload<S extends boolean | null | undefined | TranscriptArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Transcript :
    S extends undefined ? never :
    S extends { include: any } & (TranscriptArgs | TranscriptFindManyArgs)
    ? Transcript 
    : S extends { select: any } & (TranscriptArgs | TranscriptFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Transcript ? Transcript[P] : never
  } 
      : Transcript


  type TranscriptCountArgs = 
    Omit<TranscriptFindManyArgs, 'select' | 'include'> & {
      select?: TranscriptCountAggregateInputType | true
    }

  export interface TranscriptDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Transcript that matches the filter.
     * @param {TranscriptFindUniqueArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TranscriptFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TranscriptFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Transcript'> extends True ? Prisma__TranscriptClient<TranscriptGetPayload<T>> : Prisma__TranscriptClient<TranscriptGetPayload<T> | null, null>

    /**
     * Find one Transcript that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TranscriptFindUniqueOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TranscriptFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, TranscriptFindUniqueOrThrowArgs>
    ): Prisma__TranscriptClient<TranscriptGetPayload<T>>

    /**
     * Find the first Transcript that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TranscriptFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TranscriptFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Transcript'> extends True ? Prisma__TranscriptClient<TranscriptGetPayload<T>> : Prisma__TranscriptClient<TranscriptGetPayload<T> | null, null>

    /**
     * Find the first Transcript that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TranscriptFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TranscriptFindFirstOrThrowArgs>
    ): Prisma__TranscriptClient<TranscriptGetPayload<T>>

    /**
     * Find zero or more Transcripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transcripts
     * const transcripts = await prisma.transcript.findMany()
     * 
     * // Get first 10 Transcripts
     * const transcripts = await prisma.transcript.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptWithIdOnly = await prisma.transcript.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TranscriptFindManyArgs>(
      args?: SelectSubset<T, TranscriptFindManyArgs>
    ): Prisma.PrismaPromise<Array<TranscriptGetPayload<T>>>

    /**
     * Create a Transcript.
     * @param {TranscriptCreateArgs} args - Arguments to create a Transcript.
     * @example
     * // Create one Transcript
     * const Transcript = await prisma.transcript.create({
     *   data: {
     *     // ... data to create a Transcript
     *   }
     * })
     * 
    **/
    create<T extends TranscriptCreateArgs>(
      args: SelectSubset<T, TranscriptCreateArgs>
    ): Prisma__TranscriptClient<TranscriptGetPayload<T>>

    /**
     * Create many Transcripts.
     *     @param {TranscriptCreateManyArgs} args - Arguments to create many Transcripts.
     *     @example
     *     // Create many Transcripts
     *     const transcript = await prisma.transcript.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TranscriptCreateManyArgs>(
      args?: SelectSubset<T, TranscriptCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Transcript.
     * @param {TranscriptDeleteArgs} args - Arguments to delete one Transcript.
     * @example
     * // Delete one Transcript
     * const Transcript = await prisma.transcript.delete({
     *   where: {
     *     // ... filter to delete one Transcript
     *   }
     * })
     * 
    **/
    delete<T extends TranscriptDeleteArgs>(
      args: SelectSubset<T, TranscriptDeleteArgs>
    ): Prisma__TranscriptClient<TranscriptGetPayload<T>>

    /**
     * Update one Transcript.
     * @param {TranscriptUpdateArgs} args - Arguments to update one Transcript.
     * @example
     * // Update one Transcript
     * const transcript = await prisma.transcript.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TranscriptUpdateArgs>(
      args: SelectSubset<T, TranscriptUpdateArgs>
    ): Prisma__TranscriptClient<TranscriptGetPayload<T>>

    /**
     * Delete zero or more Transcripts.
     * @param {TranscriptDeleteManyArgs} args - Arguments to filter Transcripts to delete.
     * @example
     * // Delete a few Transcripts
     * const { count } = await prisma.transcript.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TranscriptDeleteManyArgs>(
      args?: SelectSubset<T, TranscriptDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TranscriptUpdateManyArgs>(
      args: SelectSubset<T, TranscriptUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transcript.
     * @param {TranscriptUpsertArgs} args - Arguments to update or create a Transcript.
     * @example
     * // Update or create a Transcript
     * const transcript = await prisma.transcript.upsert({
     *   create: {
     *     // ... data to create a Transcript
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transcript we want to update
     *   }
     * })
    **/
    upsert<T extends TranscriptUpsertArgs>(
      args: SelectSubset<T, TranscriptUpsertArgs>
    ): Prisma__TranscriptClient<TranscriptGetPayload<T>>

    /**
     * Count the number of Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptCountArgs} args - Arguments to filter Transcripts to count.
     * @example
     * // Count the number of Transcripts
     * const count = await prisma.transcript.count({
     *   where: {
     *     // ... the filter for the Transcripts we want to count
     *   }
     * })
    **/
    count<T extends TranscriptCountArgs>(
      args?: Subset<T, TranscriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranscriptAggregateArgs>(args: Subset<T, TranscriptAggregateArgs>): Prisma.PrismaPromise<GetTranscriptAggregateType<T>>

    /**
     * Group by Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranscriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranscriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Transcript.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TranscriptClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Transcript base type for findUnique actions
   */
  export type TranscriptFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findUnique
   */
  export interface TranscriptFindUniqueArgs extends TranscriptFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Transcript findUniqueOrThrow
   */
  export type TranscriptFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }


  /**
   * Transcript base type for findFirst actions
   */
  export type TranscriptFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: Enumerable<TranscriptOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: Enumerable<TranscriptScalarFieldEnum>
  }

  /**
   * Transcript findFirst
   */
  export interface TranscriptFindFirstArgs extends TranscriptFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Transcript findFirstOrThrow
   */
  export type TranscriptFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: Enumerable<TranscriptOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: Enumerable<TranscriptScalarFieldEnum>
  }


  /**
   * Transcript findMany
   */
  export type TranscriptFindManyArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * Filter, which Transcripts to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: Enumerable<TranscriptOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    distinct?: Enumerable<TranscriptScalarFieldEnum>
  }


  /**
   * Transcript create
   */
  export type TranscriptCreateArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * The data needed to create a Transcript.
     */
    data: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
  }


  /**
   * Transcript createMany
   */
  export type TranscriptCreateManyArgs = {
    /**
     * The data used to create many Transcripts.
     */
    data: Enumerable<TranscriptCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Transcript update
   */
  export type TranscriptUpdateArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * The data needed to update a Transcript.
     */
    data: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
    /**
     * Choose, which Transcript to update.
     */
    where: TranscriptWhereUniqueInput
  }


  /**
   * Transcript updateMany
   */
  export type TranscriptUpdateManyArgs = {
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
  }


  /**
   * Transcript upsert
   */
  export type TranscriptUpsertArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * The filter to search for the Transcript to update in case it exists.
     */
    where: TranscriptWhereUniqueInput
    /**
     * In case the Transcript found by the `where` argument doesn't exist, create a new Transcript with this data.
     */
    create: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
    /**
     * In case the Transcript was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
  }


  /**
   * Transcript delete
   */
  export type TranscriptDeleteArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
    /**
     * Filter which Transcript to delete.
     */
    where: TranscriptWhereUniqueInput
  }


  /**
   * Transcript deleteMany
   */
  export type TranscriptDeleteManyArgs = {
    /**
     * Filter which Transcripts to delete
     */
    where?: TranscriptWhereInput
  }


  /**
   * Transcript without action
   */
  export type TranscriptArgs = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect | null
  }



  /**
   * Model Clips
   */


  export type AggregateClips = {
    _count: ClipsCountAggregateOutputType | null
    _avg: ClipsAvgAggregateOutputType | null
    _sum: ClipsSumAggregateOutputType | null
    _min: ClipsMinAggregateOutputType | null
    _max: ClipsMaxAggregateOutputType | null
  }

  export type ClipsAvgAggregateOutputType = {
    video_offset: number | null
    view_count: number | null
    duration: Decimal | null
  }

  export type ClipsSumAggregateOutputType = {
    video_offset: number | null
    view_count: number | null
    duration: Decimal | null
  }

  export type ClipsMinAggregateOutputType = {
    id: string | null
    created_at: Date | null
    last_update: Date | null
    broadcaster_id: string | null
    broadcaster_name: string | null
    creator_id: string | null
    creator_name: string | null
    title: string | null
    video_id: string | null
    video_offset: number | null
    thumbnail_url: string | null
    view_count: number | null
    duration: Decimal | null
    online: boolean | null
  }

  export type ClipsMaxAggregateOutputType = {
    id: string | null
    created_at: Date | null
    last_update: Date | null
    broadcaster_id: string | null
    broadcaster_name: string | null
    creator_id: string | null
    creator_name: string | null
    title: string | null
    video_id: string | null
    video_offset: number | null
    thumbnail_url: string | null
    view_count: number | null
    duration: Decimal | null
    online: boolean | null
  }

  export type ClipsCountAggregateOutputType = {
    id: number
    created_at: number
    last_update: number
    broadcaster_id: number
    broadcaster_name: number
    creator_id: number
    creator_name: number
    title: number
    video_id: number
    video_offset: number
    thumbnail_url: number
    view_count: number
    duration: number
    online: number
    data: number
    _all: number
  }


  export type ClipsAvgAggregateInputType = {
    video_offset?: true
    view_count?: true
    duration?: true
  }

  export type ClipsSumAggregateInputType = {
    video_offset?: true
    view_count?: true
    duration?: true
  }

  export type ClipsMinAggregateInputType = {
    id?: true
    created_at?: true
    last_update?: true
    broadcaster_id?: true
    broadcaster_name?: true
    creator_id?: true
    creator_name?: true
    title?: true
    video_id?: true
    video_offset?: true
    thumbnail_url?: true
    view_count?: true
    duration?: true
    online?: true
  }

  export type ClipsMaxAggregateInputType = {
    id?: true
    created_at?: true
    last_update?: true
    broadcaster_id?: true
    broadcaster_name?: true
    creator_id?: true
    creator_name?: true
    title?: true
    video_id?: true
    video_offset?: true
    thumbnail_url?: true
    view_count?: true
    duration?: true
    online?: true
  }

  export type ClipsCountAggregateInputType = {
    id?: true
    created_at?: true
    last_update?: true
    broadcaster_id?: true
    broadcaster_name?: true
    creator_id?: true
    creator_name?: true
    title?: true
    video_id?: true
    video_offset?: true
    thumbnail_url?: true
    view_count?: true
    duration?: true
    online?: true
    data?: true
    _all?: true
  }

  export type ClipsAggregateArgs = {
    /**
     * Filter which Clips to aggregate.
     */
    where?: ClipsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: Enumerable<ClipsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClipsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clips
    **/
    _count?: true | ClipsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClipsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClipsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClipsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClipsMaxAggregateInputType
  }

  export type GetClipsAggregateType<T extends ClipsAggregateArgs> = {
        [P in keyof T & keyof AggregateClips]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClips[P]>
      : GetScalarType<T[P], AggregateClips[P]>
  }




  export type ClipsGroupByArgs = {
    where?: ClipsWhereInput
    orderBy?: Enumerable<ClipsOrderByWithAggregationInput>
    by: ClipsScalarFieldEnum[]
    having?: ClipsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClipsCountAggregateInputType | true
    _avg?: ClipsAvgAggregateInputType
    _sum?: ClipsSumAggregateInputType
    _min?: ClipsMinAggregateInputType
    _max?: ClipsMaxAggregateInputType
  }


  export type ClipsGroupByOutputType = {
    id: string
    created_at: Date
    last_update: Date
    broadcaster_id: string
    broadcaster_name: string
    creator_id: string
    creator_name: string
    title: string
    video_id: string
    video_offset: number
    thumbnail_url: string
    view_count: number
    duration: Decimal
    online: boolean
    data: JsonValue | null
    _count: ClipsCountAggregateOutputType | null
    _avg: ClipsAvgAggregateOutputType | null
    _sum: ClipsSumAggregateOutputType | null
    _min: ClipsMinAggregateOutputType | null
    _max: ClipsMaxAggregateOutputType | null
  }

  type GetClipsGroupByPayload<T extends ClipsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ClipsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClipsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClipsGroupByOutputType[P]>
            : GetScalarType<T[P], ClipsGroupByOutputType[P]>
        }
      >
    >


  export type ClipsSelect = {
    id?: boolean
    created_at?: boolean
    last_update?: boolean
    broadcaster_id?: boolean
    broadcaster_name?: boolean
    creator_id?: boolean
    creator_name?: boolean
    title?: boolean
    video_id?: boolean
    video_offset?: boolean
    thumbnail_url?: boolean
    view_count?: boolean
    duration?: boolean
    online?: boolean
    data?: boolean
  }


  export type ClipsGetPayload<S extends boolean | null | undefined | ClipsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Clips :
    S extends undefined ? never :
    S extends { include: any } & (ClipsArgs | ClipsFindManyArgs)
    ? Clips 
    : S extends { select: any } & (ClipsArgs | ClipsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Clips ? Clips[P] : never
  } 
      : Clips


  type ClipsCountArgs = 
    Omit<ClipsFindManyArgs, 'select' | 'include'> & {
      select?: ClipsCountAggregateInputType | true
    }

  export interface ClipsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Clips that matches the filter.
     * @param {ClipsFindUniqueArgs} args - Arguments to find a Clips
     * @example
     * // Get one Clips
     * const clips = await prisma.clips.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ClipsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ClipsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Clips'> extends True ? Prisma__ClipsClient<ClipsGetPayload<T>> : Prisma__ClipsClient<ClipsGetPayload<T> | null, null>

    /**
     * Find one Clips that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ClipsFindUniqueOrThrowArgs} args - Arguments to find a Clips
     * @example
     * // Get one Clips
     * const clips = await prisma.clips.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ClipsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ClipsFindUniqueOrThrowArgs>
    ): Prisma__ClipsClient<ClipsGetPayload<T>>

    /**
     * Find the first Clips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsFindFirstArgs} args - Arguments to find a Clips
     * @example
     * // Get one Clips
     * const clips = await prisma.clips.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ClipsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ClipsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Clips'> extends True ? Prisma__ClipsClient<ClipsGetPayload<T>> : Prisma__ClipsClient<ClipsGetPayload<T> | null, null>

    /**
     * Find the first Clips that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsFindFirstOrThrowArgs} args - Arguments to find a Clips
     * @example
     * // Get one Clips
     * const clips = await prisma.clips.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ClipsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ClipsFindFirstOrThrowArgs>
    ): Prisma__ClipsClient<ClipsGetPayload<T>>

    /**
     * Find zero or more Clips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clips
     * const clips = await prisma.clips.findMany()
     * 
     * // Get first 10 Clips
     * const clips = await prisma.clips.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clipsWithIdOnly = await prisma.clips.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ClipsFindManyArgs>(
      args?: SelectSubset<T, ClipsFindManyArgs>
    ): Prisma.PrismaPromise<Array<ClipsGetPayload<T>>>

    /**
     * Create a Clips.
     * @param {ClipsCreateArgs} args - Arguments to create a Clips.
     * @example
     * // Create one Clips
     * const Clips = await prisma.clips.create({
     *   data: {
     *     // ... data to create a Clips
     *   }
     * })
     * 
    **/
    create<T extends ClipsCreateArgs>(
      args: SelectSubset<T, ClipsCreateArgs>
    ): Prisma__ClipsClient<ClipsGetPayload<T>>

    /**
     * Create many Clips.
     *     @param {ClipsCreateManyArgs} args - Arguments to create many Clips.
     *     @example
     *     // Create many Clips
     *     const clips = await prisma.clips.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ClipsCreateManyArgs>(
      args?: SelectSubset<T, ClipsCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Clips.
     * @param {ClipsDeleteArgs} args - Arguments to delete one Clips.
     * @example
     * // Delete one Clips
     * const Clips = await prisma.clips.delete({
     *   where: {
     *     // ... filter to delete one Clips
     *   }
     * })
     * 
    **/
    delete<T extends ClipsDeleteArgs>(
      args: SelectSubset<T, ClipsDeleteArgs>
    ): Prisma__ClipsClient<ClipsGetPayload<T>>

    /**
     * Update one Clips.
     * @param {ClipsUpdateArgs} args - Arguments to update one Clips.
     * @example
     * // Update one Clips
     * const clips = await prisma.clips.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ClipsUpdateArgs>(
      args: SelectSubset<T, ClipsUpdateArgs>
    ): Prisma__ClipsClient<ClipsGetPayload<T>>

    /**
     * Delete zero or more Clips.
     * @param {ClipsDeleteManyArgs} args - Arguments to filter Clips to delete.
     * @example
     * // Delete a few Clips
     * const { count } = await prisma.clips.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ClipsDeleteManyArgs>(
      args?: SelectSubset<T, ClipsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clips
     * const clips = await prisma.clips.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ClipsUpdateManyArgs>(
      args: SelectSubset<T, ClipsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Clips.
     * @param {ClipsUpsertArgs} args - Arguments to update or create a Clips.
     * @example
     * // Update or create a Clips
     * const clips = await prisma.clips.upsert({
     *   create: {
     *     // ... data to create a Clips
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Clips we want to update
     *   }
     * })
    **/
    upsert<T extends ClipsUpsertArgs>(
      args: SelectSubset<T, ClipsUpsertArgs>
    ): Prisma__ClipsClient<ClipsGetPayload<T>>

    /**
     * Count the number of Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsCountArgs} args - Arguments to filter Clips to count.
     * @example
     * // Count the number of Clips
     * const count = await prisma.clips.count({
     *   where: {
     *     // ... the filter for the Clips we want to count
     *   }
     * })
    **/
    count<T extends ClipsCountArgs>(
      args?: Subset<T, ClipsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClipsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClipsAggregateArgs>(args: Subset<T, ClipsAggregateArgs>): Prisma.PrismaPromise<GetClipsAggregateType<T>>

    /**
     * Group by Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClipsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClipsGroupByArgs['orderBy'] }
        : { orderBy?: ClipsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClipsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClipsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Clips.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ClipsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Clips base type for findUnique actions
   */
  export type ClipsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * Filter, which Clips to fetch.
     */
    where: ClipsWhereUniqueInput
  }

  /**
   * Clips findUnique
   */
  export interface ClipsFindUniqueArgs extends ClipsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Clips findUniqueOrThrow
   */
  export type ClipsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * Filter, which Clips to fetch.
     */
    where: ClipsWhereUniqueInput
  }


  /**
   * Clips base type for findFirst actions
   */
  export type ClipsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * Filter, which Clips to fetch.
     */
    where?: ClipsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: Enumerable<ClipsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clips.
     */
    cursor?: ClipsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clips.
     */
    distinct?: Enumerable<ClipsScalarFieldEnum>
  }

  /**
   * Clips findFirst
   */
  export interface ClipsFindFirstArgs extends ClipsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Clips findFirstOrThrow
   */
  export type ClipsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * Filter, which Clips to fetch.
     */
    where?: ClipsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: Enumerable<ClipsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clips.
     */
    cursor?: ClipsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clips.
     */
    distinct?: Enumerable<ClipsScalarFieldEnum>
  }


  /**
   * Clips findMany
   */
  export type ClipsFindManyArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * Filter, which Clips to fetch.
     */
    where?: ClipsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: Enumerable<ClipsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clips.
     */
    cursor?: ClipsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    distinct?: Enumerable<ClipsScalarFieldEnum>
  }


  /**
   * Clips create
   */
  export type ClipsCreateArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * The data needed to create a Clips.
     */
    data: XOR<ClipsCreateInput, ClipsUncheckedCreateInput>
  }


  /**
   * Clips createMany
   */
  export type ClipsCreateManyArgs = {
    /**
     * The data used to create many Clips.
     */
    data: Enumerable<ClipsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Clips update
   */
  export type ClipsUpdateArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * The data needed to update a Clips.
     */
    data: XOR<ClipsUpdateInput, ClipsUncheckedUpdateInput>
    /**
     * Choose, which Clips to update.
     */
    where: ClipsWhereUniqueInput
  }


  /**
   * Clips updateMany
   */
  export type ClipsUpdateManyArgs = {
    /**
     * The data used to update Clips.
     */
    data: XOR<ClipsUpdateManyMutationInput, ClipsUncheckedUpdateManyInput>
    /**
     * Filter which Clips to update
     */
    where?: ClipsWhereInput
  }


  /**
   * Clips upsert
   */
  export type ClipsUpsertArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * The filter to search for the Clips to update in case it exists.
     */
    where: ClipsWhereUniqueInput
    /**
     * In case the Clips found by the `where` argument doesn't exist, create a new Clips with this data.
     */
    create: XOR<ClipsCreateInput, ClipsUncheckedCreateInput>
    /**
     * In case the Clips was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClipsUpdateInput, ClipsUncheckedUpdateInput>
  }


  /**
   * Clips delete
   */
  export type ClipsDeleteArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
    /**
     * Filter which Clips to delete.
     */
    where: ClipsWhereUniqueInput
  }


  /**
   * Clips deleteMany
   */
  export type ClipsDeleteManyArgs = {
    /**
     * Filter which Clips to delete
     */
    where?: ClipsWhereInput
  }


  /**
   * Clips without action
   */
  export type ClipsArgs = {
    /**
     * Select specific fields to fetch from the Clips
     */
    select?: ClipsSelect | null
  }



  /**
   * Model ClipsViews
   */


  export type AggregateClipsViews = {
    _count: ClipsViewsCountAggregateOutputType | null
    _avg: ClipsViewsAvgAggregateOutputType | null
    _sum: ClipsViewsSumAggregateOutputType | null
    _min: ClipsViewsMinAggregateOutputType | null
    _max: ClipsViewsMaxAggregateOutputType | null
  }

  export type ClipsViewsAvgAggregateOutputType = {
    view_count: number | null
  }

  export type ClipsViewsSumAggregateOutputType = {
    view_count: number | null
  }

  export type ClipsViewsMinAggregateOutputType = {
    id: string | null
    date: Date | null
    view_count: number | null
  }

  export type ClipsViewsMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    view_count: number | null
  }

  export type ClipsViewsCountAggregateOutputType = {
    id: number
    date: number
    view_count: number
    _all: number
  }


  export type ClipsViewsAvgAggregateInputType = {
    view_count?: true
  }

  export type ClipsViewsSumAggregateInputType = {
    view_count?: true
  }

  export type ClipsViewsMinAggregateInputType = {
    id?: true
    date?: true
    view_count?: true
  }

  export type ClipsViewsMaxAggregateInputType = {
    id?: true
    date?: true
    view_count?: true
  }

  export type ClipsViewsCountAggregateInputType = {
    id?: true
    date?: true
    view_count?: true
    _all?: true
  }

  export type ClipsViewsAggregateArgs = {
    /**
     * Filter which ClipsViews to aggregate.
     */
    where?: ClipsViewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipsViews to fetch.
     */
    orderBy?: Enumerable<ClipsViewsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClipsViewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipsViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipsViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClipsViews
    **/
    _count?: true | ClipsViewsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClipsViewsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClipsViewsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClipsViewsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClipsViewsMaxAggregateInputType
  }

  export type GetClipsViewsAggregateType<T extends ClipsViewsAggregateArgs> = {
        [P in keyof T & keyof AggregateClipsViews]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClipsViews[P]>
      : GetScalarType<T[P], AggregateClipsViews[P]>
  }




  export type ClipsViewsGroupByArgs = {
    where?: ClipsViewsWhereInput
    orderBy?: Enumerable<ClipsViewsOrderByWithAggregationInput>
    by: ClipsViewsScalarFieldEnum[]
    having?: ClipsViewsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClipsViewsCountAggregateInputType | true
    _avg?: ClipsViewsAvgAggregateInputType
    _sum?: ClipsViewsSumAggregateInputType
    _min?: ClipsViewsMinAggregateInputType
    _max?: ClipsViewsMaxAggregateInputType
  }


  export type ClipsViewsGroupByOutputType = {
    id: string
    date: Date
    view_count: number
    _count: ClipsViewsCountAggregateOutputType | null
    _avg: ClipsViewsAvgAggregateOutputType | null
    _sum: ClipsViewsSumAggregateOutputType | null
    _min: ClipsViewsMinAggregateOutputType | null
    _max: ClipsViewsMaxAggregateOutputType | null
  }

  type GetClipsViewsGroupByPayload<T extends ClipsViewsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ClipsViewsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClipsViewsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClipsViewsGroupByOutputType[P]>
            : GetScalarType<T[P], ClipsViewsGroupByOutputType[P]>
        }
      >
    >


  export type ClipsViewsSelect = {
    id?: boolean
    date?: boolean
    view_count?: boolean
  }


  export type ClipsViewsGetPayload<S extends boolean | null | undefined | ClipsViewsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? ClipsViews :
    S extends undefined ? never :
    S extends { include: any } & (ClipsViewsArgs | ClipsViewsFindManyArgs)
    ? ClipsViews 
    : S extends { select: any } & (ClipsViewsArgs | ClipsViewsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof ClipsViews ? ClipsViews[P] : never
  } 
      : ClipsViews


  type ClipsViewsCountArgs = 
    Omit<ClipsViewsFindManyArgs, 'select' | 'include'> & {
      select?: ClipsViewsCountAggregateInputType | true
    }

  export interface ClipsViewsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one ClipsViews that matches the filter.
     * @param {ClipsViewsFindUniqueArgs} args - Arguments to find a ClipsViews
     * @example
     * // Get one ClipsViews
     * const clipsViews = await prisma.clipsViews.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ClipsViewsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ClipsViewsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ClipsViews'> extends True ? Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>> : Prisma__ClipsViewsClient<ClipsViewsGetPayload<T> | null, null>

    /**
     * Find one ClipsViews that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ClipsViewsFindUniqueOrThrowArgs} args - Arguments to find a ClipsViews
     * @example
     * // Get one ClipsViews
     * const clipsViews = await prisma.clipsViews.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ClipsViewsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ClipsViewsFindUniqueOrThrowArgs>
    ): Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>>

    /**
     * Find the first ClipsViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsFindFirstArgs} args - Arguments to find a ClipsViews
     * @example
     * // Get one ClipsViews
     * const clipsViews = await prisma.clipsViews.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ClipsViewsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ClipsViewsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ClipsViews'> extends True ? Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>> : Prisma__ClipsViewsClient<ClipsViewsGetPayload<T> | null, null>

    /**
     * Find the first ClipsViews that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsFindFirstOrThrowArgs} args - Arguments to find a ClipsViews
     * @example
     * // Get one ClipsViews
     * const clipsViews = await prisma.clipsViews.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ClipsViewsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ClipsViewsFindFirstOrThrowArgs>
    ): Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>>

    /**
     * Find zero or more ClipsViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClipsViews
     * const clipsViews = await prisma.clipsViews.findMany()
     * 
     * // Get first 10 ClipsViews
     * const clipsViews = await prisma.clipsViews.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clipsViewsWithIdOnly = await prisma.clipsViews.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ClipsViewsFindManyArgs>(
      args?: SelectSubset<T, ClipsViewsFindManyArgs>
    ): Prisma.PrismaPromise<Array<ClipsViewsGetPayload<T>>>

    /**
     * Create a ClipsViews.
     * @param {ClipsViewsCreateArgs} args - Arguments to create a ClipsViews.
     * @example
     * // Create one ClipsViews
     * const ClipsViews = await prisma.clipsViews.create({
     *   data: {
     *     // ... data to create a ClipsViews
     *   }
     * })
     * 
    **/
    create<T extends ClipsViewsCreateArgs>(
      args: SelectSubset<T, ClipsViewsCreateArgs>
    ): Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>>

    /**
     * Create many ClipsViews.
     *     @param {ClipsViewsCreateManyArgs} args - Arguments to create many ClipsViews.
     *     @example
     *     // Create many ClipsViews
     *     const clipsViews = await prisma.clipsViews.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ClipsViewsCreateManyArgs>(
      args?: SelectSubset<T, ClipsViewsCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ClipsViews.
     * @param {ClipsViewsDeleteArgs} args - Arguments to delete one ClipsViews.
     * @example
     * // Delete one ClipsViews
     * const ClipsViews = await prisma.clipsViews.delete({
     *   where: {
     *     // ... filter to delete one ClipsViews
     *   }
     * })
     * 
    **/
    delete<T extends ClipsViewsDeleteArgs>(
      args: SelectSubset<T, ClipsViewsDeleteArgs>
    ): Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>>

    /**
     * Update one ClipsViews.
     * @param {ClipsViewsUpdateArgs} args - Arguments to update one ClipsViews.
     * @example
     * // Update one ClipsViews
     * const clipsViews = await prisma.clipsViews.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ClipsViewsUpdateArgs>(
      args: SelectSubset<T, ClipsViewsUpdateArgs>
    ): Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>>

    /**
     * Delete zero or more ClipsViews.
     * @param {ClipsViewsDeleteManyArgs} args - Arguments to filter ClipsViews to delete.
     * @example
     * // Delete a few ClipsViews
     * const { count } = await prisma.clipsViews.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ClipsViewsDeleteManyArgs>(
      args?: SelectSubset<T, ClipsViewsDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClipsViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClipsViews
     * const clipsViews = await prisma.clipsViews.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ClipsViewsUpdateManyArgs>(
      args: SelectSubset<T, ClipsViewsUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClipsViews.
     * @param {ClipsViewsUpsertArgs} args - Arguments to update or create a ClipsViews.
     * @example
     * // Update or create a ClipsViews
     * const clipsViews = await prisma.clipsViews.upsert({
     *   create: {
     *     // ... data to create a ClipsViews
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClipsViews we want to update
     *   }
     * })
    **/
    upsert<T extends ClipsViewsUpsertArgs>(
      args: SelectSubset<T, ClipsViewsUpsertArgs>
    ): Prisma__ClipsViewsClient<ClipsViewsGetPayload<T>>

    /**
     * Count the number of ClipsViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsCountArgs} args - Arguments to filter ClipsViews to count.
     * @example
     * // Count the number of ClipsViews
     * const count = await prisma.clipsViews.count({
     *   where: {
     *     // ... the filter for the ClipsViews we want to count
     *   }
     * })
    **/
    count<T extends ClipsViewsCountArgs>(
      args?: Subset<T, ClipsViewsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClipsViewsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClipsViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClipsViewsAggregateArgs>(args: Subset<T, ClipsViewsAggregateArgs>): Prisma.PrismaPromise<GetClipsViewsAggregateType<T>>

    /**
     * Group by ClipsViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipsViewsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClipsViewsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClipsViewsGroupByArgs['orderBy'] }
        : { orderBy?: ClipsViewsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClipsViewsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClipsViewsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ClipsViews.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ClipsViewsClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ClipsViews base type for findUnique actions
   */
  export type ClipsViewsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * Filter, which ClipsViews to fetch.
     */
    where: ClipsViewsWhereUniqueInput
  }

  /**
   * ClipsViews findUnique
   */
  export interface ClipsViewsFindUniqueArgs extends ClipsViewsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ClipsViews findUniqueOrThrow
   */
  export type ClipsViewsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * Filter, which ClipsViews to fetch.
     */
    where: ClipsViewsWhereUniqueInput
  }


  /**
   * ClipsViews base type for findFirst actions
   */
  export type ClipsViewsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * Filter, which ClipsViews to fetch.
     */
    where?: ClipsViewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipsViews to fetch.
     */
    orderBy?: Enumerable<ClipsViewsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClipsViews.
     */
    cursor?: ClipsViewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipsViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipsViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClipsViews.
     */
    distinct?: Enumerable<ClipsViewsScalarFieldEnum>
  }

  /**
   * ClipsViews findFirst
   */
  export interface ClipsViewsFindFirstArgs extends ClipsViewsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ClipsViews findFirstOrThrow
   */
  export type ClipsViewsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * Filter, which ClipsViews to fetch.
     */
    where?: ClipsViewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipsViews to fetch.
     */
    orderBy?: Enumerable<ClipsViewsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClipsViews.
     */
    cursor?: ClipsViewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipsViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipsViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClipsViews.
     */
    distinct?: Enumerable<ClipsViewsScalarFieldEnum>
  }


  /**
   * ClipsViews findMany
   */
  export type ClipsViewsFindManyArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * Filter, which ClipsViews to fetch.
     */
    where?: ClipsViewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClipsViews to fetch.
     */
    orderBy?: Enumerable<ClipsViewsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClipsViews.
     */
    cursor?: ClipsViewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClipsViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClipsViews.
     */
    skip?: number
    distinct?: Enumerable<ClipsViewsScalarFieldEnum>
  }


  /**
   * ClipsViews create
   */
  export type ClipsViewsCreateArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * The data needed to create a ClipsViews.
     */
    data: XOR<ClipsViewsCreateInput, ClipsViewsUncheckedCreateInput>
  }


  /**
   * ClipsViews createMany
   */
  export type ClipsViewsCreateManyArgs = {
    /**
     * The data used to create many ClipsViews.
     */
    data: Enumerable<ClipsViewsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ClipsViews update
   */
  export type ClipsViewsUpdateArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * The data needed to update a ClipsViews.
     */
    data: XOR<ClipsViewsUpdateInput, ClipsViewsUncheckedUpdateInput>
    /**
     * Choose, which ClipsViews to update.
     */
    where: ClipsViewsWhereUniqueInput
  }


  /**
   * ClipsViews updateMany
   */
  export type ClipsViewsUpdateManyArgs = {
    /**
     * The data used to update ClipsViews.
     */
    data: XOR<ClipsViewsUpdateManyMutationInput, ClipsViewsUncheckedUpdateManyInput>
    /**
     * Filter which ClipsViews to update
     */
    where?: ClipsViewsWhereInput
  }


  /**
   * ClipsViews upsert
   */
  export type ClipsViewsUpsertArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * The filter to search for the ClipsViews to update in case it exists.
     */
    where: ClipsViewsWhereUniqueInput
    /**
     * In case the ClipsViews found by the `where` argument doesn't exist, create a new ClipsViews with this data.
     */
    create: XOR<ClipsViewsCreateInput, ClipsViewsUncheckedCreateInput>
    /**
     * In case the ClipsViews was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClipsViewsUpdateInput, ClipsViewsUncheckedUpdateInput>
  }


  /**
   * ClipsViews delete
   */
  export type ClipsViewsDeleteArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
    /**
     * Filter which ClipsViews to delete.
     */
    where: ClipsViewsWhereUniqueInput
  }


  /**
   * ClipsViews deleteMany
   */
  export type ClipsViewsDeleteManyArgs = {
    /**
     * Filter which ClipsViews to delete
     */
    where?: ClipsViewsWhereInput
  }


  /**
   * ClipsViews without action
   */
  export type ClipsViewsArgs = {
    /**
     * Select specific fields to fetch from the ClipsViews
     */
    select?: ClipsViewsSelect | null
  }



  /**
   * Model RetryLog
   */


  export type AggregateRetryLog = {
    _count: RetryLogCountAggregateOutputType | null
    _avg: RetryLogAvgAggregateOutputType | null
    _sum: RetryLogSumAggregateOutputType | null
    _min: RetryLogMinAggregateOutputType | null
    _max: RetryLogMaxAggregateOutputType | null
  }

  export type RetryLogAvgAggregateOutputType = {
    id: number | null
  }

  export type RetryLogSumAggregateOutputType = {
    id: bigint | null
  }

  export type RetryLogMinAggregateOutputType = {
    id: bigint | null
    topic: string | null
    time: Date | null
  }

  export type RetryLogMaxAggregateOutputType = {
    id: bigint | null
    topic: string | null
    time: Date | null
  }

  export type RetryLogCountAggregateOutputType = {
    id: number
    topic: number
    time: number
    data: number
    _all: number
  }


  export type RetryLogAvgAggregateInputType = {
    id?: true
  }

  export type RetryLogSumAggregateInputType = {
    id?: true
  }

  export type RetryLogMinAggregateInputType = {
    id?: true
    topic?: true
    time?: true
  }

  export type RetryLogMaxAggregateInputType = {
    id?: true
    topic?: true
    time?: true
  }

  export type RetryLogCountAggregateInputType = {
    id?: true
    topic?: true
    time?: true
    data?: true
    _all?: true
  }

  export type RetryLogAggregateArgs = {
    /**
     * Filter which RetryLog to aggregate.
     */
    where?: RetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetryLogs to fetch.
     */
    orderBy?: Enumerable<RetryLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetryLogs
    **/
    _count?: true | RetryLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RetryLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RetryLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetryLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetryLogMaxAggregateInputType
  }

  export type GetRetryLogAggregateType<T extends RetryLogAggregateArgs> = {
        [P in keyof T & keyof AggregateRetryLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetryLog[P]>
      : GetScalarType<T[P], AggregateRetryLog[P]>
  }




  export type RetryLogGroupByArgs = {
    where?: RetryLogWhereInput
    orderBy?: Enumerable<RetryLogOrderByWithAggregationInput>
    by: RetryLogScalarFieldEnum[]
    having?: RetryLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetryLogCountAggregateInputType | true
    _avg?: RetryLogAvgAggregateInputType
    _sum?: RetryLogSumAggregateInputType
    _min?: RetryLogMinAggregateInputType
    _max?: RetryLogMaxAggregateInputType
  }


  export type RetryLogGroupByOutputType = {
    id: bigint
    topic: string
    time: Date
    data: JsonValue
    _count: RetryLogCountAggregateOutputType | null
    _avg: RetryLogAvgAggregateOutputType | null
    _sum: RetryLogSumAggregateOutputType | null
    _min: RetryLogMinAggregateOutputType | null
    _max: RetryLogMaxAggregateOutputType | null
  }

  type GetRetryLogGroupByPayload<T extends RetryLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<RetryLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetryLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetryLogGroupByOutputType[P]>
            : GetScalarType<T[P], RetryLogGroupByOutputType[P]>
        }
      >
    >


  export type RetryLogSelect = {
    id?: boolean
    topic?: boolean
    time?: boolean
    data?: boolean
  }


  export type RetryLogGetPayload<S extends boolean | null | undefined | RetryLogArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? RetryLog :
    S extends undefined ? never :
    S extends { include: any } & (RetryLogArgs | RetryLogFindManyArgs)
    ? RetryLog 
    : S extends { select: any } & (RetryLogArgs | RetryLogFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof RetryLog ? RetryLog[P] : never
  } 
      : RetryLog


  type RetryLogCountArgs = 
    Omit<RetryLogFindManyArgs, 'select' | 'include'> & {
      select?: RetryLogCountAggregateInputType | true
    }

  export interface RetryLogDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one RetryLog that matches the filter.
     * @param {RetryLogFindUniqueArgs} args - Arguments to find a RetryLog
     * @example
     * // Get one RetryLog
     * const retryLog = await prisma.retryLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends RetryLogFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, RetryLogFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'RetryLog'> extends True ? Prisma__RetryLogClient<RetryLogGetPayload<T>> : Prisma__RetryLogClient<RetryLogGetPayload<T> | null, null>

    /**
     * Find one RetryLog that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {RetryLogFindUniqueOrThrowArgs} args - Arguments to find a RetryLog
     * @example
     * // Get one RetryLog
     * const retryLog = await prisma.retryLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends RetryLogFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, RetryLogFindUniqueOrThrowArgs>
    ): Prisma__RetryLogClient<RetryLogGetPayload<T>>

    /**
     * Find the first RetryLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogFindFirstArgs} args - Arguments to find a RetryLog
     * @example
     * // Get one RetryLog
     * const retryLog = await prisma.retryLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends RetryLogFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, RetryLogFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'RetryLog'> extends True ? Prisma__RetryLogClient<RetryLogGetPayload<T>> : Prisma__RetryLogClient<RetryLogGetPayload<T> | null, null>

    /**
     * Find the first RetryLog that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogFindFirstOrThrowArgs} args - Arguments to find a RetryLog
     * @example
     * // Get one RetryLog
     * const retryLog = await prisma.retryLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends RetryLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RetryLogFindFirstOrThrowArgs>
    ): Prisma__RetryLogClient<RetryLogGetPayload<T>>

    /**
     * Find zero or more RetryLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetryLogs
     * const retryLogs = await prisma.retryLog.findMany()
     * 
     * // Get first 10 RetryLogs
     * const retryLogs = await prisma.retryLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retryLogWithIdOnly = await prisma.retryLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends RetryLogFindManyArgs>(
      args?: SelectSubset<T, RetryLogFindManyArgs>
    ): Prisma.PrismaPromise<Array<RetryLogGetPayload<T>>>

    /**
     * Create a RetryLog.
     * @param {RetryLogCreateArgs} args - Arguments to create a RetryLog.
     * @example
     * // Create one RetryLog
     * const RetryLog = await prisma.retryLog.create({
     *   data: {
     *     // ... data to create a RetryLog
     *   }
     * })
     * 
    **/
    create<T extends RetryLogCreateArgs>(
      args: SelectSubset<T, RetryLogCreateArgs>
    ): Prisma__RetryLogClient<RetryLogGetPayload<T>>

    /**
     * Create many RetryLogs.
     *     @param {RetryLogCreateManyArgs} args - Arguments to create many RetryLogs.
     *     @example
     *     // Create many RetryLogs
     *     const retryLog = await prisma.retryLog.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends RetryLogCreateManyArgs>(
      args?: SelectSubset<T, RetryLogCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RetryLog.
     * @param {RetryLogDeleteArgs} args - Arguments to delete one RetryLog.
     * @example
     * // Delete one RetryLog
     * const RetryLog = await prisma.retryLog.delete({
     *   where: {
     *     // ... filter to delete one RetryLog
     *   }
     * })
     * 
    **/
    delete<T extends RetryLogDeleteArgs>(
      args: SelectSubset<T, RetryLogDeleteArgs>
    ): Prisma__RetryLogClient<RetryLogGetPayload<T>>

    /**
     * Update one RetryLog.
     * @param {RetryLogUpdateArgs} args - Arguments to update one RetryLog.
     * @example
     * // Update one RetryLog
     * const retryLog = await prisma.retryLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends RetryLogUpdateArgs>(
      args: SelectSubset<T, RetryLogUpdateArgs>
    ): Prisma__RetryLogClient<RetryLogGetPayload<T>>

    /**
     * Delete zero or more RetryLogs.
     * @param {RetryLogDeleteManyArgs} args - Arguments to filter RetryLogs to delete.
     * @example
     * // Delete a few RetryLogs
     * const { count } = await prisma.retryLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends RetryLogDeleteManyArgs>(
      args?: SelectSubset<T, RetryLogDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetryLogs
     * const retryLog = await prisma.retryLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends RetryLogUpdateManyArgs>(
      args: SelectSubset<T, RetryLogUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetryLog.
     * @param {RetryLogUpsertArgs} args - Arguments to update or create a RetryLog.
     * @example
     * // Update or create a RetryLog
     * const retryLog = await prisma.retryLog.upsert({
     *   create: {
     *     // ... data to create a RetryLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetryLog we want to update
     *   }
     * })
    **/
    upsert<T extends RetryLogUpsertArgs>(
      args: SelectSubset<T, RetryLogUpsertArgs>
    ): Prisma__RetryLogClient<RetryLogGetPayload<T>>

    /**
     * Count the number of RetryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogCountArgs} args - Arguments to filter RetryLogs to count.
     * @example
     * // Count the number of RetryLogs
     * const count = await prisma.retryLog.count({
     *   where: {
     *     // ... the filter for the RetryLogs we want to count
     *   }
     * })
    **/
    count<T extends RetryLogCountArgs>(
      args?: Subset<T, RetryLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetryLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RetryLogAggregateArgs>(args: Subset<T, RetryLogAggregateArgs>): Prisma.PrismaPromise<GetRetryLogAggregateType<T>>

    /**
     * Group by RetryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetryLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RetryLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetryLogGroupByArgs['orderBy'] }
        : { orderBy?: RetryLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RetryLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetryLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for RetryLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__RetryLogClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * RetryLog base type for findUnique actions
   */
  export type RetryLogFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * Filter, which RetryLog to fetch.
     */
    where: RetryLogWhereUniqueInput
  }

  /**
   * RetryLog findUnique
   */
  export interface RetryLogFindUniqueArgs extends RetryLogFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * RetryLog findUniqueOrThrow
   */
  export type RetryLogFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * Filter, which RetryLog to fetch.
     */
    where: RetryLogWhereUniqueInput
  }


  /**
   * RetryLog base type for findFirst actions
   */
  export type RetryLogFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * Filter, which RetryLog to fetch.
     */
    where?: RetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetryLogs to fetch.
     */
    orderBy?: Enumerable<RetryLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetryLogs.
     */
    cursor?: RetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetryLogs.
     */
    distinct?: Enumerable<RetryLogScalarFieldEnum>
  }

  /**
   * RetryLog findFirst
   */
  export interface RetryLogFindFirstArgs extends RetryLogFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * RetryLog findFirstOrThrow
   */
  export type RetryLogFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * Filter, which RetryLog to fetch.
     */
    where?: RetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetryLogs to fetch.
     */
    orderBy?: Enumerable<RetryLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetryLogs.
     */
    cursor?: RetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetryLogs.
     */
    distinct?: Enumerable<RetryLogScalarFieldEnum>
  }


  /**
   * RetryLog findMany
   */
  export type RetryLogFindManyArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * Filter, which RetryLogs to fetch.
     */
    where?: RetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetryLogs to fetch.
     */
    orderBy?: Enumerable<RetryLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetryLogs.
     */
    cursor?: RetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetryLogs.
     */
    skip?: number
    distinct?: Enumerable<RetryLogScalarFieldEnum>
  }


  /**
   * RetryLog create
   */
  export type RetryLogCreateArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * The data needed to create a RetryLog.
     */
    data: XOR<RetryLogCreateInput, RetryLogUncheckedCreateInput>
  }


  /**
   * RetryLog createMany
   */
  export type RetryLogCreateManyArgs = {
    /**
     * The data used to create many RetryLogs.
     */
    data: Enumerable<RetryLogCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * RetryLog update
   */
  export type RetryLogUpdateArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * The data needed to update a RetryLog.
     */
    data: XOR<RetryLogUpdateInput, RetryLogUncheckedUpdateInput>
    /**
     * Choose, which RetryLog to update.
     */
    where: RetryLogWhereUniqueInput
  }


  /**
   * RetryLog updateMany
   */
  export type RetryLogUpdateManyArgs = {
    /**
     * The data used to update RetryLogs.
     */
    data: XOR<RetryLogUpdateManyMutationInput, RetryLogUncheckedUpdateManyInput>
    /**
     * Filter which RetryLogs to update
     */
    where?: RetryLogWhereInput
  }


  /**
   * RetryLog upsert
   */
  export type RetryLogUpsertArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * The filter to search for the RetryLog to update in case it exists.
     */
    where: RetryLogWhereUniqueInput
    /**
     * In case the RetryLog found by the `where` argument doesn't exist, create a new RetryLog with this data.
     */
    create: XOR<RetryLogCreateInput, RetryLogUncheckedCreateInput>
    /**
     * In case the RetryLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetryLogUpdateInput, RetryLogUncheckedUpdateInput>
  }


  /**
   * RetryLog delete
   */
  export type RetryLogDeleteArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
    /**
     * Filter which RetryLog to delete.
     */
    where: RetryLogWhereUniqueInput
  }


  /**
   * RetryLog deleteMany
   */
  export type RetryLogDeleteManyArgs = {
    /**
     * Filter which RetryLogs to delete
     */
    where?: RetryLogWhereInput
  }


  /**
   * RetryLog without action
   */
  export type RetryLogArgs = {
    /**
     * Select specific fields to fetch from the RetryLog
     */
    select?: RetryLogSelect | null
  }



  /**
   * Model Task
   */


  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    id: number | null
    groupId: number | null
  }

  export type TaskSumAggregateOutputType = {
    id: bigint | null
    groupId: bigint | null
  }

  export type TaskMinAggregateOutputType = {
    id: bigint | null
    groupId: bigint | null
    task: string | null
    started: Date | null
    completed: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: bigint | null
    groupId: bigint | null
    task: string | null
    started: Date | null
    completed: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    groupId: number
    task: number
    dependencies: number
    started: number
    completed: number
    data: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    id?: true
    groupId?: true
  }

  export type TaskSumAggregateInputType = {
    id?: true
    groupId?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    groupId?: true
    task?: true
    started?: true
    completed?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    groupId?: true
    task?: true
    started?: true
    completed?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    groupId?: true
    task?: true
    dependencies?: true
    started?: true
    completed?: true
    data?: true
    _all?: true
  }

  export type TaskAggregateArgs = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: Enumerable<TaskOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs = {
    where?: TaskWhereInput
    orderBy?: Enumerable<TaskOrderByWithAggregationInput>
    by: TaskScalarFieldEnum[]
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }


  export type TaskGroupByOutputType = {
    id: bigint
    groupId: bigint
    task: string
    dependencies: string[]
    started: Date | null
    completed: Date | null
    data: JsonValue
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect = {
    id?: boolean
    groupId?: boolean
    task?: boolean
    dependencies?: boolean
    started?: boolean
    completed?: boolean
    data?: boolean
  }


  export type TaskGetPayload<S extends boolean | null | undefined | TaskArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Task :
    S extends undefined ? never :
    S extends { include: any } & (TaskArgs | TaskFindManyArgs)
    ? Task 
    : S extends { select: any } & (TaskArgs | TaskFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Task ? Task[P] : never
  } 
      : Task


  type TaskCountArgs = 
    Omit<TaskFindManyArgs, 'select' | 'include'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TaskFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TaskFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Task'> extends True ? Prisma__TaskClient<TaskGetPayload<T>> : Prisma__TaskClient<TaskGetPayload<T> | null, null>

    /**
     * Find one Task that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, TaskFindUniqueOrThrowArgs>
    ): Prisma__TaskClient<TaskGetPayload<T>>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TaskFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TaskFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Task'> extends True ? Prisma__TaskClient<TaskGetPayload<T>> : Prisma__TaskClient<TaskGetPayload<T> | null, null>

    /**
     * Find the first Task that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TaskFindFirstOrThrowArgs>
    ): Prisma__TaskClient<TaskGetPayload<T>>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TaskFindManyArgs>(
      args?: SelectSubset<T, TaskFindManyArgs>
    ): Prisma.PrismaPromise<Array<TaskGetPayload<T>>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
    **/
    create<T extends TaskCreateArgs>(
      args: SelectSubset<T, TaskCreateArgs>
    ): Prisma__TaskClient<TaskGetPayload<T>>

    /**
     * Create many Tasks.
     *     @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     *     @example
     *     // Create many Tasks
     *     const task = await prisma.task.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TaskCreateManyArgs>(
      args?: SelectSubset<T, TaskCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
    **/
    delete<T extends TaskDeleteArgs>(
      args: SelectSubset<T, TaskDeleteArgs>
    ): Prisma__TaskClient<TaskGetPayload<T>>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TaskUpdateArgs>(
      args: SelectSubset<T, TaskUpdateArgs>
    ): Prisma__TaskClient<TaskGetPayload<T>>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TaskDeleteManyArgs>(
      args?: SelectSubset<T, TaskDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TaskUpdateManyArgs>(
      args: SelectSubset<T, TaskUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
    **/
    upsert<T extends TaskUpsertArgs>(
      args: SelectSubset<T, TaskUpsertArgs>
    ): Prisma__TaskClient<TaskGetPayload<T>>

    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TaskClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Task base type for findUnique actions
   */
  export type TaskFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUnique
   */
  export interface TaskFindUniqueArgs extends TaskFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }


  /**
   * Task base type for findFirst actions
   */
  export type TaskFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: Enumerable<TaskOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: Enumerable<TaskScalarFieldEnum>
  }

  /**
   * Task findFirst
   */
  export interface TaskFindFirstArgs extends TaskFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: Enumerable<TaskOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: Enumerable<TaskScalarFieldEnum>
  }


  /**
   * Task findMany
   */
  export type TaskFindManyArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: Enumerable<TaskOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: Enumerable<TaskScalarFieldEnum>
  }


  /**
   * Task create
   */
  export type TaskCreateArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }


  /**
   * Task createMany
   */
  export type TaskCreateManyArgs = {
    /**
     * The data used to create many Tasks.
     */
    data: Enumerable<TaskCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Task update
   */
  export type TaskUpdateArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }


  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }


  /**
   * Task upsert
   */
  export type TaskUpsertArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }


  /**
   * Task delete
   */
  export type TaskDeleteArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }


  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }


  /**
   * Task without action
   */
  export type TaskArgs = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const ChatEmoteScalarFieldEnum: {
    id: 'id',
    source: 'source',
    name: 'name',
    ext: 'ext',
    data: 'data'
  };

  export type ChatEmoteScalarFieldEnum = (typeof ChatEmoteScalarFieldEnum)[keyof typeof ChatEmoteScalarFieldEnum]


  export const ChatMessageEmoteScalarFieldEnum: {
    messageId: 'messageId',
    emoteId: 'emoteId',
    emoteSource: 'emoteSource',
    startIdx: 'startIdx',
    endIdx: 'endIdx'
  };

  export type ChatMessageEmoteScalarFieldEnum = (typeof ChatMessageEmoteScalarFieldEnum)[keyof typeof ChatMessageEmoteScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    channel: 'channel',
    username: 'username',
    message: 'message',
    command: 'command',
    time: 'time',
    data: 'data',
    emotes: 'emotes'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const ClipsScalarFieldEnum: {
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
  };

  export type ClipsScalarFieldEnum = (typeof ClipsScalarFieldEnum)[keyof typeof ClipsScalarFieldEnum]


  export const ClipsViewsScalarFieldEnum: {
    id: 'id',
    date: 'date',
    view_count: 'view_count'
  };

  export type ClipsViewsScalarFieldEnum = (typeof ClipsViewsScalarFieldEnum)[keyof typeof ClipsViewsScalarFieldEnum]


  export const FileScalarFieldEnum: {
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
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const RecordingScalarFieldEnum: {
    id: 'id',
    start: 'start',
    stop: 'stop',
    channel: 'channel',
    site_id: 'site_id',
    data: 'data'
  };

  export type RecordingScalarFieldEnum = (typeof RecordingScalarFieldEnum)[keyof typeof RecordingScalarFieldEnum]


  export const RetryLogScalarFieldEnum: {
    id: 'id',
    topic: 'topic',
    time: 'time',
    data: 'data'
  };

  export type RetryLogScalarFieldEnum = (typeof RetryLogScalarFieldEnum)[keyof typeof RetryLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const StoryboardScalarFieldEnum: {
    recordingId: 'recordingId',
    index: 'index',
    firstSequence: 'firstSequence',
    timeOffset: 'timeOffset',
    interval: 'interval',
    rows: 'rows',
    columns: 'columns',
    slug: 'slug',
    data: 'data'
  };

  export type StoryboardScalarFieldEnum = (typeof StoryboardScalarFieldEnum)[keyof typeof StoryboardScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    task: 'task',
    dependencies: 'dependencies',
    started: 'started',
    completed: 'completed',
    data: 'data'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TranscriptScalarFieldEnum: {
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
  };

  export type TranscriptScalarFieldEnum = (typeof TranscriptScalarFieldEnum)[keyof typeof TranscriptScalarFieldEnum]


  /**
   * Deep Input Types
   */


  export type ChatEmoteWhereInput = {
    AND?: Enumerable<ChatEmoteWhereInput>
    OR?: Enumerable<ChatEmoteWhereInput>
    NOT?: Enumerable<ChatEmoteWhereInput>
    id?: StringFilter | string
    source?: EnumEmoteSourceFilter | EmoteSource
    name?: StringFilter | string
    ext?: StringFilter | string
    data?: JsonFilter
  }

  export type ChatEmoteOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    name?: SortOrder
    ext?: SortOrder
    data?: SortOrder
  }

  export type ChatEmoteWhereUniqueInput = {
    id_source?: ChatEmoteIdSourceCompoundUniqueInput
  }

  export type ChatEmoteOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    name?: SortOrder
    ext?: SortOrder
    data?: SortOrder
    _count?: ChatEmoteCountOrderByAggregateInput
    _max?: ChatEmoteMaxOrderByAggregateInput
    _min?: ChatEmoteMinOrderByAggregateInput
  }

  export type ChatEmoteScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ChatEmoteScalarWhereWithAggregatesInput>
    OR?: Enumerable<ChatEmoteScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ChatEmoteScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    source?: EnumEmoteSourceWithAggregatesFilter | EmoteSource
    name?: StringWithAggregatesFilter | string
    ext?: StringWithAggregatesFilter | string
    data?: JsonWithAggregatesFilter
  }

  export type ChatMessageWhereInput = {
    AND?: Enumerable<ChatMessageWhereInput>
    OR?: Enumerable<ChatMessageWhereInput>
    NOT?: Enumerable<ChatMessageWhereInput>
    id?: UuidFilter | string
    channel?: StringFilter | string
    username?: StringFilter | string
    message?: StringFilter | string
    command?: StringFilter | string
    time?: DateTimeFilter | Date | string
    data?: JsonFilter
    emotes?: JsonFilter
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    channel?: SortOrder
    username?: SortOrder
    message?: SortOrder
    command?: SortOrder
    time?: SortOrder
    data?: SortOrder
    emotes?: SortOrder
  }

  export type ChatMessageWhereUniqueInput = {
    id?: string
  }

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    channel?: SortOrder
    username?: SortOrder
    message?: SortOrder
    command?: SortOrder
    time?: SortOrder
    data?: SortOrder
    emotes?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ChatMessageScalarWhereWithAggregatesInput>
    OR?: Enumerable<ChatMessageScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ChatMessageScalarWhereWithAggregatesInput>
    id?: UuidWithAggregatesFilter | string
    channel?: StringWithAggregatesFilter | string
    username?: StringWithAggregatesFilter | string
    message?: StringWithAggregatesFilter | string
    command?: StringWithAggregatesFilter | string
    time?: DateTimeWithAggregatesFilter | Date | string
    data?: JsonWithAggregatesFilter
    emotes?: JsonWithAggregatesFilter
  }

  export type ChatMessageEmoteWhereInput = {
    AND?: Enumerable<ChatMessageEmoteWhereInput>
    OR?: Enumerable<ChatMessageEmoteWhereInput>
    NOT?: Enumerable<ChatMessageEmoteWhereInput>
    messageId?: UuidFilter | string
    emoteId?: UuidFilter | string
    emoteSource?: UuidFilter | string
    startIdx?: IntFilter | number
    endIdx?: IntFilter | number
  }

  export type ChatMessageEmoteOrderByWithRelationInput = {
    messageId?: SortOrder
    emoteId?: SortOrder
    emoteSource?: SortOrder
    startIdx?: SortOrder
    endIdx?: SortOrder
  }

  export type ChatMessageEmoteWhereUniqueInput = {
    messageId_emoteId_emoteSource_startIdx?: ChatMessageEmoteMessageIdEmoteIdEmoteSourceStartIdxCompoundUniqueInput
  }

  export type ChatMessageEmoteOrderByWithAggregationInput = {
    messageId?: SortOrder
    emoteId?: SortOrder
    emoteSource?: SortOrder
    startIdx?: SortOrder
    endIdx?: SortOrder
    _count?: ChatMessageEmoteCountOrderByAggregateInput
    _avg?: ChatMessageEmoteAvgOrderByAggregateInput
    _max?: ChatMessageEmoteMaxOrderByAggregateInput
    _min?: ChatMessageEmoteMinOrderByAggregateInput
    _sum?: ChatMessageEmoteSumOrderByAggregateInput
  }

  export type ChatMessageEmoteScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ChatMessageEmoteScalarWhereWithAggregatesInput>
    OR?: Enumerable<ChatMessageEmoteScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ChatMessageEmoteScalarWhereWithAggregatesInput>
    messageId?: UuidWithAggregatesFilter | string
    emoteId?: UuidWithAggregatesFilter | string
    emoteSource?: UuidWithAggregatesFilter | string
    startIdx?: IntWithAggregatesFilter | number
    endIdx?: IntWithAggregatesFilter | number
  }

  export type FileWhereInput = {
    AND?: Enumerable<FileWhereInput>
    OR?: Enumerable<FileWhereInput>
    NOT?: Enumerable<FileWhereInput>
    recordingId?: BigIntFilter | bigint | number
    name?: StringFilter | string
    seq?: IntFilter | number
    timeOffset?: DecimalFilter | Decimal | DecimalJsLike | number | string
    duration?: DecimalFilter | Decimal | DecimalJsLike | number | string
    retries?: IntFilter | number
    datetime?: DateTimeFilter | Date | string
    size?: IntFilter | number
    downloaded?: IntFilter | number
    hash?: StringFilter | string
    status?: EnumFileStatusNullableFilter | FileStatus | null
  }

  export type FileOrderByWithRelationInput = {
    recordingId?: SortOrder
    name?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    datetime?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
    hash?: SortOrder
    status?: SortOrder
  }

  export type FileWhereUniqueInput = {
    recordingId_name?: FileRecordingIdNameCompoundUniqueInput
  }

  export type FileOrderByWithAggregationInput = {
    recordingId?: SortOrder
    name?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    datetime?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
    hash?: SortOrder
    status?: SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: Enumerable<FileScalarWhereWithAggregatesInput>
    OR?: Enumerable<FileScalarWhereWithAggregatesInput>
    NOT?: Enumerable<FileScalarWhereWithAggregatesInput>
    recordingId?: BigIntWithAggregatesFilter | bigint | number
    name?: StringWithAggregatesFilter | string
    seq?: IntWithAggregatesFilter | number
    timeOffset?: DecimalWithAggregatesFilter | Decimal | DecimalJsLike | number | string
    duration?: DecimalWithAggregatesFilter | Decimal | DecimalJsLike | number | string
    retries?: IntWithAggregatesFilter | number
    datetime?: DateTimeWithAggregatesFilter | Date | string
    size?: IntWithAggregatesFilter | number
    downloaded?: IntWithAggregatesFilter | number
    hash?: StringWithAggregatesFilter | string
    status?: EnumFileStatusNullableWithAggregatesFilter | FileStatus | null
  }

  export type RecordingWhereInput = {
    AND?: Enumerable<RecordingWhereInput>
    OR?: Enumerable<RecordingWhereInput>
    NOT?: Enumerable<RecordingWhereInput>
    id?: BigIntFilter | bigint | number
    start?: DateTimeFilter | Date | string
    stop?: DateTimeNullableFilter | Date | string | null
    channel?: StringFilter | string
    site_id?: StringFilter | string
    data?: JsonNullableFilter
  }

  export type RecordingOrderByWithRelationInput = {
    id?: SortOrder
    start?: SortOrder
    stop?: SortOrder
    channel?: SortOrder
    site_id?: SortOrder
    data?: SortOrder
  }

  export type RecordingWhereUniqueInput = {
    id?: bigint | number
  }

  export type RecordingOrderByWithAggregationInput = {
    id?: SortOrder
    start?: SortOrder
    stop?: SortOrder
    channel?: SortOrder
    site_id?: SortOrder
    data?: SortOrder
    _count?: RecordingCountOrderByAggregateInput
    _avg?: RecordingAvgOrderByAggregateInput
    _max?: RecordingMaxOrderByAggregateInput
    _min?: RecordingMinOrderByAggregateInput
    _sum?: RecordingSumOrderByAggregateInput
  }

  export type RecordingScalarWhereWithAggregatesInput = {
    AND?: Enumerable<RecordingScalarWhereWithAggregatesInput>
    OR?: Enumerable<RecordingScalarWhereWithAggregatesInput>
    NOT?: Enumerable<RecordingScalarWhereWithAggregatesInput>
    id?: BigIntWithAggregatesFilter | bigint | number
    start?: DateTimeWithAggregatesFilter | Date | string
    stop?: DateTimeNullableWithAggregatesFilter | Date | string | null
    channel?: StringWithAggregatesFilter | string
    site_id?: StringWithAggregatesFilter | string
    data?: JsonNullableWithAggregatesFilter
  }

  export type StoryboardWhereInput = {
    AND?: Enumerable<StoryboardWhereInput>
    OR?: Enumerable<StoryboardWhereInput>
    NOT?: Enumerable<StoryboardWhereInput>
    recordingId?: BigIntFilter | bigint | number
    index?: IntFilter | number
    firstSequence?: IntFilter | number
    timeOffset?: DecimalFilter | Decimal | DecimalJsLike | number | string
    interval?: IntFilter | number
    rows?: IntFilter | number
    columns?: IntFilter | number
    slug?: StringFilter | string
    data?: JsonFilter
  }

  export type StoryboardOrderByWithRelationInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    slug?: SortOrder
    data?: SortOrder
  }

  export type StoryboardWhereUniqueInput = {
    recordingId_index?: StoryboardRecordingIdIndexCompoundUniqueInput
  }

  export type StoryboardOrderByWithAggregationInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    slug?: SortOrder
    data?: SortOrder
    _count?: StoryboardCountOrderByAggregateInput
    _avg?: StoryboardAvgOrderByAggregateInput
    _max?: StoryboardMaxOrderByAggregateInput
    _min?: StoryboardMinOrderByAggregateInput
    _sum?: StoryboardSumOrderByAggregateInput
  }

  export type StoryboardScalarWhereWithAggregatesInput = {
    AND?: Enumerable<StoryboardScalarWhereWithAggregatesInput>
    OR?: Enumerable<StoryboardScalarWhereWithAggregatesInput>
    NOT?: Enumerable<StoryboardScalarWhereWithAggregatesInput>
    recordingId?: BigIntWithAggregatesFilter | bigint | number
    index?: IntWithAggregatesFilter | number
    firstSequence?: IntWithAggregatesFilter | number
    timeOffset?: DecimalWithAggregatesFilter | Decimal | DecimalJsLike | number | string
    interval?: IntWithAggregatesFilter | number
    rows?: IntWithAggregatesFilter | number
    columns?: IntWithAggregatesFilter | number
    slug?: StringWithAggregatesFilter | string
    data?: JsonWithAggregatesFilter
  }

  export type TranscriptWhereInput = {
    AND?: Enumerable<TranscriptWhereInput>
    OR?: Enumerable<TranscriptWhereInput>
    NOT?: Enumerable<TranscriptWhereInput>
    id?: BigIntFilter | bigint | number
    recordingId?: BigIntFilter | bigint | number
    transcript?: StringFilter | string
    totalStart?: IntFilter | number
    totalEnd?: IntFilter | number
    segmentSequence?: IntFilter | number
    audiostart?: IntFilter | number
    audioEnd?: IntFilter | number
    confidence?: FloatFilter | number
    created?: DateTimeFilter | Date | string
    words?: JsonFilter
  }

  export type TranscriptOrderByWithRelationInput = {
    id?: SortOrder
    recordingId?: SortOrder
    transcript?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
    created?: SortOrder
    words?: SortOrder
  }

  export type TranscriptWhereUniqueInput = {
    id?: bigint | number
  }

  export type TranscriptOrderByWithAggregationInput = {
    id?: SortOrder
    recordingId?: SortOrder
    transcript?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
    created?: SortOrder
    words?: SortOrder
    _count?: TranscriptCountOrderByAggregateInput
    _avg?: TranscriptAvgOrderByAggregateInput
    _max?: TranscriptMaxOrderByAggregateInput
    _min?: TranscriptMinOrderByAggregateInput
    _sum?: TranscriptSumOrderByAggregateInput
  }

  export type TranscriptScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TranscriptScalarWhereWithAggregatesInput>
    OR?: Enumerable<TranscriptScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TranscriptScalarWhereWithAggregatesInput>
    id?: BigIntWithAggregatesFilter | bigint | number
    recordingId?: BigIntWithAggregatesFilter | bigint | number
    transcript?: StringWithAggregatesFilter | string
    totalStart?: IntWithAggregatesFilter | number
    totalEnd?: IntWithAggregatesFilter | number
    segmentSequence?: IntWithAggregatesFilter | number
    audiostart?: IntWithAggregatesFilter | number
    audioEnd?: IntWithAggregatesFilter | number
    confidence?: FloatWithAggregatesFilter | number
    created?: DateTimeWithAggregatesFilter | Date | string
    words?: JsonWithAggregatesFilter
  }

  export type ClipsWhereInput = {
    AND?: Enumerable<ClipsWhereInput>
    OR?: Enumerable<ClipsWhereInput>
    NOT?: Enumerable<ClipsWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    last_update?: DateTimeFilter | Date | string
    broadcaster_id?: StringFilter | string
    broadcaster_name?: StringFilter | string
    creator_id?: StringFilter | string
    creator_name?: StringFilter | string
    title?: StringFilter | string
    video_id?: StringFilter | string
    video_offset?: IntFilter | number
    thumbnail_url?: StringFilter | string
    view_count?: IntFilter | number
    duration?: DecimalFilter | Decimal | DecimalJsLike | number | string
    online?: BoolFilter | boolean
    data?: JsonNullableFilter
  }

  export type ClipsOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    last_update?: SortOrder
    broadcaster_id?: SortOrder
    broadcaster_name?: SortOrder
    creator_id?: SortOrder
    creator_name?: SortOrder
    title?: SortOrder
    video_id?: SortOrder
    video_offset?: SortOrder
    thumbnail_url?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
    online?: SortOrder
    data?: SortOrder
  }

  export type ClipsWhereUniqueInput = {
    id?: string
  }

  export type ClipsOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    last_update?: SortOrder
    broadcaster_id?: SortOrder
    broadcaster_name?: SortOrder
    creator_id?: SortOrder
    creator_name?: SortOrder
    title?: SortOrder
    video_id?: SortOrder
    video_offset?: SortOrder
    thumbnail_url?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
    online?: SortOrder
    data?: SortOrder
    _count?: ClipsCountOrderByAggregateInput
    _avg?: ClipsAvgOrderByAggregateInput
    _max?: ClipsMaxOrderByAggregateInput
    _min?: ClipsMinOrderByAggregateInput
    _sum?: ClipsSumOrderByAggregateInput
  }

  export type ClipsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ClipsScalarWhereWithAggregatesInput>
    OR?: Enumerable<ClipsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ClipsScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
    last_update?: DateTimeWithAggregatesFilter | Date | string
    broadcaster_id?: StringWithAggregatesFilter | string
    broadcaster_name?: StringWithAggregatesFilter | string
    creator_id?: StringWithAggregatesFilter | string
    creator_name?: StringWithAggregatesFilter | string
    title?: StringWithAggregatesFilter | string
    video_id?: StringWithAggregatesFilter | string
    video_offset?: IntWithAggregatesFilter | number
    thumbnail_url?: StringWithAggregatesFilter | string
    view_count?: IntWithAggregatesFilter | number
    duration?: DecimalWithAggregatesFilter | Decimal | DecimalJsLike | number | string
    online?: BoolWithAggregatesFilter | boolean
    data?: JsonNullableWithAggregatesFilter
  }

  export type ClipsViewsWhereInput = {
    AND?: Enumerable<ClipsViewsWhereInput>
    OR?: Enumerable<ClipsViewsWhereInput>
    NOT?: Enumerable<ClipsViewsWhereInput>
    id?: StringFilter | string
    date?: DateTimeFilter | Date | string
    view_count?: IntFilter | number
  }

  export type ClipsViewsOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    view_count?: SortOrder
  }

  export type ClipsViewsWhereUniqueInput = {
    id_view_count?: ClipsViewsIdView_countCompoundUniqueInput
  }

  export type ClipsViewsOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    view_count?: SortOrder
    _count?: ClipsViewsCountOrderByAggregateInput
    _avg?: ClipsViewsAvgOrderByAggregateInput
    _max?: ClipsViewsMaxOrderByAggregateInput
    _min?: ClipsViewsMinOrderByAggregateInput
    _sum?: ClipsViewsSumOrderByAggregateInput
  }

  export type ClipsViewsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ClipsViewsScalarWhereWithAggregatesInput>
    OR?: Enumerable<ClipsViewsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ClipsViewsScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    date?: DateTimeWithAggregatesFilter | Date | string
    view_count?: IntWithAggregatesFilter | number
  }

  export type RetryLogWhereInput = {
    AND?: Enumerable<RetryLogWhereInput>
    OR?: Enumerable<RetryLogWhereInput>
    NOT?: Enumerable<RetryLogWhereInput>
    id?: BigIntFilter | bigint | number
    topic?: StringFilter | string
    time?: DateTimeFilter | Date | string
    data?: JsonFilter
  }

  export type RetryLogOrderByWithRelationInput = {
    id?: SortOrder
    topic?: SortOrder
    time?: SortOrder
    data?: SortOrder
  }

  export type RetryLogWhereUniqueInput = {
    id?: bigint | number
  }

  export type RetryLogOrderByWithAggregationInput = {
    id?: SortOrder
    topic?: SortOrder
    time?: SortOrder
    data?: SortOrder
    _count?: RetryLogCountOrderByAggregateInput
    _avg?: RetryLogAvgOrderByAggregateInput
    _max?: RetryLogMaxOrderByAggregateInput
    _min?: RetryLogMinOrderByAggregateInput
    _sum?: RetryLogSumOrderByAggregateInput
  }

  export type RetryLogScalarWhereWithAggregatesInput = {
    AND?: Enumerable<RetryLogScalarWhereWithAggregatesInput>
    OR?: Enumerable<RetryLogScalarWhereWithAggregatesInput>
    NOT?: Enumerable<RetryLogScalarWhereWithAggregatesInput>
    id?: BigIntWithAggregatesFilter | bigint | number
    topic?: StringWithAggregatesFilter | string
    time?: DateTimeWithAggregatesFilter | Date | string
    data?: JsonWithAggregatesFilter
  }

  export type TaskWhereInput = {
    AND?: Enumerable<TaskWhereInput>
    OR?: Enumerable<TaskWhereInput>
    NOT?: Enumerable<TaskWhereInput>
    id?: BigIntFilter | bigint | number
    groupId?: BigIntFilter | bigint | number
    task?: StringFilter | string
    dependencies?: StringNullableListFilter
    started?: DateTimeNullableFilter | Date | string | null
    completed?: DateTimeNullableFilter | Date | string | null
    data?: JsonFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    task?: SortOrder
    dependencies?: SortOrder
    started?: SortOrder
    completed?: SortOrder
    data?: SortOrder
  }

  export type TaskWhereUniqueInput = {
    id?: bigint | number
  }

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    task?: SortOrder
    dependencies?: SortOrder
    started?: SortOrder
    completed?: SortOrder
    data?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TaskScalarWhereWithAggregatesInput>
    OR?: Enumerable<TaskScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TaskScalarWhereWithAggregatesInput>
    id?: BigIntWithAggregatesFilter | bigint | number
    groupId?: BigIntWithAggregatesFilter | bigint | number
    task?: StringWithAggregatesFilter | string
    dependencies?: StringNullableListFilter
    started?: DateTimeNullableWithAggregatesFilter | Date | string | null
    completed?: DateTimeNullableWithAggregatesFilter | Date | string | null
    data?: JsonWithAggregatesFilter
  }

  export type ChatEmoteCreateInput = {
    id: string
    source: EmoteSource
    name: string
    ext: string
    data: JsonNullValueInput | InputJsonValue
  }

  export type ChatEmoteUncheckedCreateInput = {
    id: string
    source: EmoteSource
    name: string
    ext: string
    data: JsonNullValueInput | InputJsonValue
  }

  export type ChatEmoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: EnumEmoteSourceFieldUpdateOperationsInput | EmoteSource
    name?: StringFieldUpdateOperationsInput | string
    ext?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type ChatEmoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: EnumEmoteSourceFieldUpdateOperationsInput | EmoteSource
    name?: StringFieldUpdateOperationsInput | string
    ext?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type ChatEmoteCreateManyInput = {
    id: string
    source: EmoteSource
    name: string
    ext: string
    data: JsonNullValueInput | InputJsonValue
  }

  export type ChatEmoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: EnumEmoteSourceFieldUpdateOperationsInput | EmoteSource
    name?: StringFieldUpdateOperationsInput | string
    ext?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type ChatEmoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: EnumEmoteSourceFieldUpdateOperationsInput | EmoteSource
    name?: StringFieldUpdateOperationsInput | string
    ext?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageCreateInput = {
    id: string
    channel: string
    username: string
    message: string
    command: string
    time: Date | string
    data: JsonNullValueInput | InputJsonValue
    emotes: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageUncheckedCreateInput = {
    id: string
    channel: string
    username: string
    message: string
    command: string
    time: Date | string
    data: JsonNullValueInput | InputJsonValue
    emotes: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    emotes?: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    emotes?: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageCreateManyInput = {
    id: string
    channel: string
    username: string
    message: string
    command: string
    time: Date | string
    data: JsonNullValueInput | InputJsonValue
    emotes: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    emotes?: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    command?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    emotes?: JsonNullValueInput | InputJsonValue
  }

  export type ChatMessageEmoteCreateInput = {
    messageId: string
    emoteId: string
    emoteSource: string
    startIdx: number
    endIdx: number
  }

  export type ChatMessageEmoteUncheckedCreateInput = {
    messageId: string
    emoteId: string
    emoteSource: string
    startIdx: number
    endIdx: number
  }

  export type ChatMessageEmoteUpdateInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    emoteId?: StringFieldUpdateOperationsInput | string
    emoteSource?: StringFieldUpdateOperationsInput | string
    startIdx?: IntFieldUpdateOperationsInput | number
    endIdx?: IntFieldUpdateOperationsInput | number
  }

  export type ChatMessageEmoteUncheckedUpdateInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    emoteId?: StringFieldUpdateOperationsInput | string
    emoteSource?: StringFieldUpdateOperationsInput | string
    startIdx?: IntFieldUpdateOperationsInput | number
    endIdx?: IntFieldUpdateOperationsInput | number
  }

  export type ChatMessageEmoteCreateManyInput = {
    messageId: string
    emoteId: string
    emoteSource: string
    startIdx: number
    endIdx: number
  }

  export type ChatMessageEmoteUpdateManyMutationInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    emoteId?: StringFieldUpdateOperationsInput | string
    emoteSource?: StringFieldUpdateOperationsInput | string
    startIdx?: IntFieldUpdateOperationsInput | number
    endIdx?: IntFieldUpdateOperationsInput | number
  }

  export type ChatMessageEmoteUncheckedUpdateManyInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    emoteId?: StringFieldUpdateOperationsInput | string
    emoteSource?: StringFieldUpdateOperationsInput | string
    startIdx?: IntFieldUpdateOperationsInput | number
    endIdx?: IntFieldUpdateOperationsInput | number
  }

  export type FileCreateInput = {
    recordingId: bigint | number
    name: string
    seq: number
    timeOffset: Decimal | DecimalJsLike | number | string
    duration: Decimal | DecimalJsLike | number | string
    retries: number
    datetime: Date | string
    size: number
    downloaded: number
    hash: string
    status?: FileStatus | null
  }

  export type FileUncheckedCreateInput = {
    recordingId: bigint | number
    name: string
    seq: number
    timeOffset: Decimal | DecimalJsLike | number | string
    duration: Decimal | DecimalJsLike | number | string
    retries: number
    datetime: Date | string
    size: number
    downloaded: number
    hash: string
    status?: FileStatus | null
  }

  export type FileUpdateInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    seq?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    retries?: IntFieldUpdateOperationsInput | number
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    size?: IntFieldUpdateOperationsInput | number
    downloaded?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumFileStatusFieldUpdateOperationsInput | FileStatus | null
  }

  export type FileUncheckedUpdateInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    seq?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    retries?: IntFieldUpdateOperationsInput | number
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    size?: IntFieldUpdateOperationsInput | number
    downloaded?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumFileStatusFieldUpdateOperationsInput | FileStatus | null
  }

  export type FileCreateManyInput = {
    recordingId: bigint | number
    name: string
    seq: number
    timeOffset: Decimal | DecimalJsLike | number | string
    duration: Decimal | DecimalJsLike | number | string
    retries: number
    datetime: Date | string
    size: number
    downloaded: number
    hash: string
    status?: FileStatus | null
  }

  export type FileUpdateManyMutationInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    seq?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    retries?: IntFieldUpdateOperationsInput | number
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    size?: IntFieldUpdateOperationsInput | number
    downloaded?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumFileStatusFieldUpdateOperationsInput | FileStatus | null
  }

  export type FileUncheckedUpdateManyInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    seq?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    retries?: IntFieldUpdateOperationsInput | number
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    size?: IntFieldUpdateOperationsInput | number
    downloaded?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumFileStatusFieldUpdateOperationsInput | FileStatus | null
  }

  export type RecordingCreateInput = {
    id?: bigint | number
    start: Date | string
    stop?: Date | string | null
    channel: string
    site_id?: string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RecordingUncheckedCreateInput = {
    id?: bigint | number
    start: Date | string
    stop?: Date | string | null
    channel: string
    site_id?: string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RecordingUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    start?: DateTimeFieldUpdateOperationsInput | Date | string
    stop?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: StringFieldUpdateOperationsInput | string
    site_id?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RecordingUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    start?: DateTimeFieldUpdateOperationsInput | Date | string
    stop?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: StringFieldUpdateOperationsInput | string
    site_id?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RecordingCreateManyInput = {
    id?: bigint | number
    start: Date | string
    stop?: Date | string | null
    channel: string
    site_id?: string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RecordingUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    start?: DateTimeFieldUpdateOperationsInput | Date | string
    stop?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: StringFieldUpdateOperationsInput | string
    site_id?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RecordingUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    start?: DateTimeFieldUpdateOperationsInput | Date | string
    stop?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: StringFieldUpdateOperationsInput | string
    site_id?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StoryboardCreateInput = {
    recordingId: bigint | number
    index: number
    firstSequence: number
    timeOffset: Decimal | DecimalJsLike | number | string
    interval: number
    rows: number
    columns: number
    slug: string
    data: JsonNullValueInput | InputJsonValue
  }

  export type StoryboardUncheckedCreateInput = {
    recordingId: bigint | number
    index: number
    firstSequence: number
    timeOffset: Decimal | DecimalJsLike | number | string
    interval: number
    rows: number
    columns: number
    slug: string
    data: JsonNullValueInput | InputJsonValue
  }

  export type StoryboardUpdateInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    index?: IntFieldUpdateOperationsInput | number
    firstSequence?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interval?: IntFieldUpdateOperationsInput | number
    rows?: IntFieldUpdateOperationsInput | number
    columns?: IntFieldUpdateOperationsInput | number
    slug?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type StoryboardUncheckedUpdateInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    index?: IntFieldUpdateOperationsInput | number
    firstSequence?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interval?: IntFieldUpdateOperationsInput | number
    rows?: IntFieldUpdateOperationsInput | number
    columns?: IntFieldUpdateOperationsInput | number
    slug?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type StoryboardCreateManyInput = {
    recordingId: bigint | number
    index: number
    firstSequence: number
    timeOffset: Decimal | DecimalJsLike | number | string
    interval: number
    rows: number
    columns: number
    slug: string
    data: JsonNullValueInput | InputJsonValue
  }

  export type StoryboardUpdateManyMutationInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    index?: IntFieldUpdateOperationsInput | number
    firstSequence?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interval?: IntFieldUpdateOperationsInput | number
    rows?: IntFieldUpdateOperationsInput | number
    columns?: IntFieldUpdateOperationsInput | number
    slug?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type StoryboardUncheckedUpdateManyInput = {
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    index?: IntFieldUpdateOperationsInput | number
    firstSequence?: IntFieldUpdateOperationsInput | number
    timeOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interval?: IntFieldUpdateOperationsInput | number
    rows?: IntFieldUpdateOperationsInput | number
    columns?: IntFieldUpdateOperationsInput | number
    slug?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptCreateInput = {
    id?: bigint | number
    recordingId: bigint | number
    transcript: string
    totalStart: number
    totalEnd: number
    segmentSequence: number
    audiostart: number
    audioEnd: number
    confidence: number
    created: Date | string
    words: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptUncheckedCreateInput = {
    id?: bigint | number
    recordingId: bigint | number
    transcript: string
    totalStart: number
    totalEnd: number
    segmentSequence: number
    audiostart: number
    audioEnd: number
    confidence: number
    created: Date | string
    words: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    transcript?: StringFieldUpdateOperationsInput | string
    totalStart?: IntFieldUpdateOperationsInput | number
    totalEnd?: IntFieldUpdateOperationsInput | number
    segmentSequence?: IntFieldUpdateOperationsInput | number
    audiostart?: IntFieldUpdateOperationsInput | number
    audioEnd?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    words?: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    transcript?: StringFieldUpdateOperationsInput | string
    totalStart?: IntFieldUpdateOperationsInput | number
    totalEnd?: IntFieldUpdateOperationsInput | number
    segmentSequence?: IntFieldUpdateOperationsInput | number
    audiostart?: IntFieldUpdateOperationsInput | number
    audioEnd?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    words?: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptCreateManyInput = {
    id?: bigint | number
    recordingId: bigint | number
    transcript: string
    totalStart: number
    totalEnd: number
    segmentSequence: number
    audiostart: number
    audioEnd: number
    confidence: number
    created: Date | string
    words: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    transcript?: StringFieldUpdateOperationsInput | string
    totalStart?: IntFieldUpdateOperationsInput | number
    totalEnd?: IntFieldUpdateOperationsInput | number
    segmentSequence?: IntFieldUpdateOperationsInput | number
    audiostart?: IntFieldUpdateOperationsInput | number
    audioEnd?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    words?: JsonNullValueInput | InputJsonValue
  }

  export type TranscriptUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    recordingId?: BigIntFieldUpdateOperationsInput | bigint | number
    transcript?: StringFieldUpdateOperationsInput | string
    totalStart?: IntFieldUpdateOperationsInput | number
    totalEnd?: IntFieldUpdateOperationsInput | number
    segmentSequence?: IntFieldUpdateOperationsInput | number
    audiostart?: IntFieldUpdateOperationsInput | number
    audioEnd?: IntFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    words?: JsonNullValueInput | InputJsonValue
  }

  export type ClipsCreateInput = {
    id: string
    created_at: Date | string
    last_update: Date | string
    broadcaster_id: string
    broadcaster_name: string
    creator_id: string
    creator_name: string
    title: string
    video_id: string
    video_offset: number
    thumbnail_url: string
    view_count: number
    duration: Decimal | DecimalJsLike | number | string
    online: boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsUncheckedCreateInput = {
    id: string
    created_at: Date | string
    last_update: Date | string
    broadcaster_id: string
    broadcaster_name: string
    creator_id: string
    creator_name: string
    title: string
    video_id: string
    video_offset: number
    thumbnail_url: string
    view_count: number
    duration: Decimal | DecimalJsLike | number | string
    online: boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    broadcaster_name?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    creator_name?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    video_id?: StringFieldUpdateOperationsInput | string
    video_offset?: IntFieldUpdateOperationsInput | number
    thumbnail_url?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    online?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    broadcaster_name?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    creator_name?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    video_id?: StringFieldUpdateOperationsInput | string
    video_offset?: IntFieldUpdateOperationsInput | number
    thumbnail_url?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    online?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsCreateManyInput = {
    id: string
    created_at: Date | string
    last_update: Date | string
    broadcaster_id: string
    broadcaster_name: string
    creator_id: string
    creator_name: string
    title: string
    video_id: string
    video_offset: number
    thumbnail_url: string
    view_count: number
    duration: Decimal | DecimalJsLike | number | string
    online: boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    broadcaster_name?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    creator_name?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    video_id?: StringFieldUpdateOperationsInput | string
    video_offset?: IntFieldUpdateOperationsInput | number
    thumbnail_url?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    online?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    broadcaster_name?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    creator_name?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    video_id?: StringFieldUpdateOperationsInput | string
    video_offset?: IntFieldUpdateOperationsInput | number
    thumbnail_url?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    online?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClipsViewsCreateInput = {
    id: string
    date: Date | string
    view_count: number
  }

  export type ClipsViewsUncheckedCreateInput = {
    id: string
    date: Date | string
    view_count: number
  }

  export type ClipsViewsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
  }

  export type ClipsViewsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
  }

  export type ClipsViewsCreateManyInput = {
    id: string
    date: Date | string
    view_count: number
  }

  export type ClipsViewsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
  }

  export type ClipsViewsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
  }

  export type RetryLogCreateInput = {
    id?: bigint | number
    topic: string
    time: Date | string
    data: JsonNullValueInput | InputJsonValue
  }

  export type RetryLogUncheckedCreateInput = {
    id?: bigint | number
    topic: string
    time: Date | string
    data: JsonNullValueInput | InputJsonValue
  }

  export type RetryLogUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    topic?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type RetryLogUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    topic?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type RetryLogCreateManyInput = {
    id?: bigint | number
    topic: string
    time: Date | string
    data: JsonNullValueInput | InputJsonValue
  }

  export type RetryLogUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    topic?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type RetryLogUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    topic?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type TaskCreateInput = {
    id?: bigint | number
    groupId: bigint | number
    task: string
    dependencies?: TaskCreatedependenciesInput | Enumerable<string>
    started?: Date | string | null
    completed?: Date | string | null
    data: JsonNullValueInput | InputJsonValue
  }

  export type TaskUncheckedCreateInput = {
    id?: bigint | number
    groupId: bigint | number
    task: string
    dependencies?: TaskCreatedependenciesInput | Enumerable<string>
    started?: Date | string | null
    completed?: Date | string | null
    data: JsonNullValueInput | InputJsonValue
  }

  export type TaskUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    groupId?: BigIntFieldUpdateOperationsInput | bigint | number
    task?: StringFieldUpdateOperationsInput | string
    dependencies?: TaskUpdatedependenciesInput | Enumerable<string>
    started?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    data?: JsonNullValueInput | InputJsonValue
  }

  export type TaskUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    groupId?: BigIntFieldUpdateOperationsInput | bigint | number
    task?: StringFieldUpdateOperationsInput | string
    dependencies?: TaskUpdatedependenciesInput | Enumerable<string>
    started?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    data?: JsonNullValueInput | InputJsonValue
  }

  export type TaskCreateManyInput = {
    id?: bigint | number
    groupId: bigint | number
    task: string
    dependencies?: TaskCreatedependenciesInput | Enumerable<string>
    started?: Date | string | null
    completed?: Date | string | null
    data: JsonNullValueInput | InputJsonValue
  }

  export type TaskUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    groupId?: BigIntFieldUpdateOperationsInput | bigint | number
    task?: StringFieldUpdateOperationsInput | string
    dependencies?: TaskUpdatedependenciesInput | Enumerable<string>
    started?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    data?: JsonNullValueInput | InputJsonValue
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    groupId?: BigIntFieldUpdateOperationsInput | bigint | number
    task?: StringFieldUpdateOperationsInput | string
    dependencies?: TaskUpdatedependenciesInput | Enumerable<string>
    started?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    data?: JsonNullValueInput | InputJsonValue
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type EnumEmoteSourceFilter = {
    equals?: EmoteSource
    in?: Enumerable<EmoteSource>
    notIn?: Enumerable<EmoteSource>
    not?: NestedEnumEmoteSourceFilter | EmoteSource
  }
  export type JsonFilter = 
    | PatchUndefined<
        Either<Required<JsonFilterBase>, Exclude<keyof Required<JsonFilterBase>, 'path'>>,
        Required<JsonFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase>, 'path'>>

  export type JsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type ChatEmoteIdSourceCompoundUniqueInput = {
    id: string
    source: EmoteSource
  }

  export type ChatEmoteCountOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    name?: SortOrder
    ext?: SortOrder
    data?: SortOrder
  }

  export type ChatEmoteMaxOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    name?: SortOrder
    ext?: SortOrder
  }

  export type ChatEmoteMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    name?: SortOrder
    ext?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type EnumEmoteSourceWithAggregatesFilter = {
    equals?: EmoteSource
    in?: Enumerable<EmoteSource>
    notIn?: Enumerable<EmoteSource>
    not?: NestedEnumEmoteSourceWithAggregatesFilter | EmoteSource
    _count?: NestedIntFilter
    _min?: NestedEnumEmoteSourceFilter
    _max?: NestedEnumEmoteSourceFilter
  }
  export type JsonWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase>, Exclude<keyof Required<JsonWithAggregatesFilterBase>, 'path'>>,
        Required<JsonWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase>, 'path'>>

  export type JsonWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntFilter
    _min?: NestedJsonFilter
    _max?: NestedJsonFilter
  }

  export type UuidFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    channel?: SortOrder
    username?: SortOrder
    message?: SortOrder
    command?: SortOrder
    time?: SortOrder
    data?: SortOrder
    emotes?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    channel?: SortOrder
    username?: SortOrder
    message?: SortOrder
    command?: SortOrder
    time?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    channel?: SortOrder
    username?: SortOrder
    message?: SortOrder
    command?: SortOrder
    time?: SortOrder
  }

  export type UuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type ChatMessageEmoteMessageIdEmoteIdEmoteSourceStartIdxCompoundUniqueInput = {
    messageId: string
    emoteId: string
    emoteSource: string
    startIdx: number
  }

  export type ChatMessageEmoteCountOrderByAggregateInput = {
    messageId?: SortOrder
    emoteId?: SortOrder
    emoteSource?: SortOrder
    startIdx?: SortOrder
    endIdx?: SortOrder
  }

  export type ChatMessageEmoteAvgOrderByAggregateInput = {
    startIdx?: SortOrder
    endIdx?: SortOrder
  }

  export type ChatMessageEmoteMaxOrderByAggregateInput = {
    messageId?: SortOrder
    emoteId?: SortOrder
    emoteSource?: SortOrder
    startIdx?: SortOrder
    endIdx?: SortOrder
  }

  export type ChatMessageEmoteMinOrderByAggregateInput = {
    messageId?: SortOrder
    emoteId?: SortOrder
    emoteSource?: SortOrder
    startIdx?: SortOrder
    endIdx?: SortOrder
  }

  export type ChatMessageEmoteSumOrderByAggregateInput = {
    startIdx?: SortOrder
    endIdx?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type BigIntFilter = {
    equals?: bigint | number
    in?: Enumerable<bigint> | Enumerable<number>
    notIn?: Enumerable<bigint> | Enumerable<number>
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntFilter | bigint | number
  }

  export type DecimalFilter = {
    equals?: Decimal | DecimalJsLike | number | string
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalFilter | Decimal | DecimalJsLike | number | string
  }

  export type EnumFileStatusNullableFilter = {
    equals?: FileStatus | null
    in?: Enumerable<FileStatus> | null
    notIn?: Enumerable<FileStatus> | null
    not?: NestedEnumFileStatusNullableFilter | FileStatus | null
  }

  export type FileRecordingIdNameCompoundUniqueInput = {
    recordingId: bigint | number
    name: string
  }

  export type FileCountOrderByAggregateInput = {
    recordingId?: SortOrder
    name?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    datetime?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
    hash?: SortOrder
    status?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    recordingId?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    recordingId?: SortOrder
    name?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    datetime?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
    hash?: SortOrder
    status?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    recordingId?: SortOrder
    name?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    datetime?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
    hash?: SortOrder
    status?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    recordingId?: SortOrder
    seq?: SortOrder
    timeOffset?: SortOrder
    duration?: SortOrder
    retries?: SortOrder
    size?: SortOrder
    downloaded?: SortOrder
  }

  export type BigIntWithAggregatesFilter = {
    equals?: bigint | number
    in?: Enumerable<bigint> | Enumerable<number>
    notIn?: Enumerable<bigint> | Enumerable<number>
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntWithAggregatesFilter | bigint | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedBigIntFilter
    _min?: NestedBigIntFilter
    _max?: NestedBigIntFilter
  }

  export type DecimalWithAggregatesFilter = {
    equals?: Decimal | DecimalJsLike | number | string
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalWithAggregatesFilter | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter
    _avg?: NestedDecimalFilter
    _sum?: NestedDecimalFilter
    _min?: NestedDecimalFilter
    _max?: NestedDecimalFilter
  }

  export type EnumFileStatusNullableWithAggregatesFilter = {
    equals?: FileStatus | null
    in?: Enumerable<FileStatus> | null
    notIn?: Enumerable<FileStatus> | null
    not?: NestedEnumFileStatusNullableWithAggregatesFilter | FileStatus | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumFileStatusNullableFilter
    _max?: NestedEnumFileStatusNullableFilter
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type RecordingCountOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    stop?: SortOrder
    channel?: SortOrder
    site_id?: SortOrder
    data?: SortOrder
  }

  export type RecordingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RecordingMaxOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    stop?: SortOrder
    channel?: SortOrder
    site_id?: SortOrder
  }

  export type RecordingMinOrderByAggregateInput = {
    id?: SortOrder
    start?: SortOrder
    stop?: SortOrder
    channel?: SortOrder
    site_id?: SortOrder
  }

  export type RecordingSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type StoryboardRecordingIdIndexCompoundUniqueInput = {
    recordingId: bigint | number
    index: number
  }

  export type StoryboardCountOrderByAggregateInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    slug?: SortOrder
    data?: SortOrder
  }

  export type StoryboardAvgOrderByAggregateInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
  }

  export type StoryboardMaxOrderByAggregateInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    slug?: SortOrder
  }

  export type StoryboardMinOrderByAggregateInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    slug?: SortOrder
  }

  export type StoryboardSumOrderByAggregateInput = {
    recordingId?: SortOrder
    index?: SortOrder
    firstSequence?: SortOrder
    timeOffset?: SortOrder
    interval?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
  }

  export type FloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type TranscriptCountOrderByAggregateInput = {
    id?: SortOrder
    recordingId?: SortOrder
    transcript?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
    created?: SortOrder
    words?: SortOrder
  }

  export type TranscriptAvgOrderByAggregateInput = {
    id?: SortOrder
    recordingId?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptMaxOrderByAggregateInput = {
    id?: SortOrder
    recordingId?: SortOrder
    transcript?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
    created?: SortOrder
  }

  export type TranscriptMinOrderByAggregateInput = {
    id?: SortOrder
    recordingId?: SortOrder
    transcript?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
    created?: SortOrder
  }

  export type TranscriptSumOrderByAggregateInput = {
    id?: SortOrder
    recordingId?: SortOrder
    totalStart?: SortOrder
    totalEnd?: SortOrder
    segmentSequence?: SortOrder
    audiostart?: SortOrder
    audioEnd?: SortOrder
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type ClipsCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    last_update?: SortOrder
    broadcaster_id?: SortOrder
    broadcaster_name?: SortOrder
    creator_id?: SortOrder
    creator_name?: SortOrder
    title?: SortOrder
    video_id?: SortOrder
    video_offset?: SortOrder
    thumbnail_url?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
    online?: SortOrder
    data?: SortOrder
  }

  export type ClipsAvgOrderByAggregateInput = {
    video_offset?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
  }

  export type ClipsMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    last_update?: SortOrder
    broadcaster_id?: SortOrder
    broadcaster_name?: SortOrder
    creator_id?: SortOrder
    creator_name?: SortOrder
    title?: SortOrder
    video_id?: SortOrder
    video_offset?: SortOrder
    thumbnail_url?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
    online?: SortOrder
  }

  export type ClipsMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    last_update?: SortOrder
    broadcaster_id?: SortOrder
    broadcaster_name?: SortOrder
    creator_id?: SortOrder
    creator_name?: SortOrder
    title?: SortOrder
    video_id?: SortOrder
    video_offset?: SortOrder
    thumbnail_url?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
    online?: SortOrder
  }

  export type ClipsSumOrderByAggregateInput = {
    video_offset?: SortOrder
    view_count?: SortOrder
    duration?: SortOrder
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type ClipsViewsIdView_countCompoundUniqueInput = {
    id: string
    view_count: number
  }

  export type ClipsViewsCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    view_count?: SortOrder
  }

  export type ClipsViewsAvgOrderByAggregateInput = {
    view_count?: SortOrder
  }

  export type ClipsViewsMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    view_count?: SortOrder
  }

  export type ClipsViewsMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    view_count?: SortOrder
  }

  export type ClipsViewsSumOrderByAggregateInput = {
    view_count?: SortOrder
  }

  export type RetryLogCountOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    time?: SortOrder
    data?: SortOrder
  }

  export type RetryLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RetryLogMaxOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    time?: SortOrder
  }

  export type RetryLogMinOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    time?: SortOrder
  }

  export type RetryLogSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    task?: SortOrder
    dependencies?: SortOrder
    started?: SortOrder
    completed?: SortOrder
    data?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    task?: SortOrder
    started?: SortOrder
    completed?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    task?: SortOrder
    started?: SortOrder
    completed?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumEmoteSourceFieldUpdateOperationsInput = {
    set?: EmoteSource
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableEnumFileStatusFieldUpdateOperationsInput = {
    set?: FileStatus | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TaskCreatedependenciesInput = {
    set: Enumerable<string>
  }

  export type TaskUpdatedependenciesInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedEnumEmoteSourceFilter = {
    equals?: EmoteSource
    in?: Enumerable<EmoteSource>
    notIn?: Enumerable<EmoteSource>
    not?: NestedEnumEmoteSourceFilter | EmoteSource
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedEnumEmoteSourceWithAggregatesFilter = {
    equals?: EmoteSource
    in?: Enumerable<EmoteSource>
    notIn?: Enumerable<EmoteSource>
    not?: NestedEnumEmoteSourceWithAggregatesFilter | EmoteSource
    _count?: NestedIntFilter
    _min?: NestedEnumEmoteSourceFilter
    _max?: NestedEnumEmoteSourceFilter
  }
  export type NestedJsonFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase>, Exclude<keyof Required<NestedJsonFilterBase>, 'path'>>,
        Required<NestedJsonFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase>, 'path'>>

  export type NestedJsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedUuidFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedUuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedBigIntFilter = {
    equals?: bigint | number
    in?: Enumerable<bigint> | Enumerable<number>
    notIn?: Enumerable<bigint> | Enumerable<number>
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntFilter | bigint | number
  }

  export type NestedDecimalFilter = {
    equals?: Decimal | DecimalJsLike | number | string
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalFilter | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumFileStatusNullableFilter = {
    equals?: FileStatus | null
    in?: Enumerable<FileStatus> | null
    notIn?: Enumerable<FileStatus> | null
    not?: NestedEnumFileStatusNullableFilter | FileStatus | null
  }

  export type NestedBigIntWithAggregatesFilter = {
    equals?: bigint | number
    in?: Enumerable<bigint> | Enumerable<number>
    notIn?: Enumerable<bigint> | Enumerable<number>
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntWithAggregatesFilter | bigint | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedBigIntFilter
    _min?: NestedBigIntFilter
    _max?: NestedBigIntFilter
  }

  export type NestedDecimalWithAggregatesFilter = {
    equals?: Decimal | DecimalJsLike | number | string
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string>
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalWithAggregatesFilter | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter
    _avg?: NestedDecimalFilter
    _sum?: NestedDecimalFilter
    _min?: NestedDecimalFilter
    _max?: NestedDecimalFilter
  }

  export type NestedEnumFileStatusNullableWithAggregatesFilter = {
    equals?: FileStatus | null
    in?: Enumerable<FileStatus> | null
    notIn?: Enumerable<FileStatus> | null
    not?: NestedEnumFileStatusNullableWithAggregatesFilter | FileStatus | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumFileStatusNullableFilter
    _max?: NestedEnumFileStatusNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}