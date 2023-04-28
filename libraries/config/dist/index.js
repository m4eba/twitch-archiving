export const KafkaConfigOpt = {
    kafkaClientId: {
        type: String,
        defaultValue: 'twitch-archiving',
    },
    kafkaBroker: {
        type: String,
        multiple: true,
    },
};
export const TwitchConfigOpt = {
    twitchClientId: { type: String },
    twitchClientSecret: { type: String },
};
export const PostgresConfigOpt = {
    pgHost: { type: String, defaultValue: 'localhost' },
    pgPort: { type: Number, defaultValue: 5432 },
    pgDatabase: { type: String },
    pgUser: { type: String, defaultValue: 'postgres' },
    pgPassword: { type: String },
};
export const RedisConfigOpt = {
    redisUrl: { type: String, defaultValue: 'redis://localhost:6379' },
};
export const FileConfigOpt = {
    config: { type: String, optional: true },
};
export const LogConfigOpt = {
    logLevel: { type: String, defaultValue: 'info' },
};
export const RetryConfigOpt = {
    retries: { type: Number, defaultValue: 3 },
    failedTopic: { type: String, defaultValue: 'failed-task' },
};
