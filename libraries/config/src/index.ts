import type { ArgumentConfig } from 'ts-command-line-args';

export interface KafkaConfig {
  kafkaClientId: string;
  kafkaBroker: string[];
}

export const KafkaConfigOpt: ArgumentConfig<KafkaConfig> = {
  kafkaClientId: {
    type: String,
    defaultValue: 'twitch-archiving',
  },
  kafkaBroker: {
    type: String,
    multiple: true,
  },
};

export interface TwitchConfig {
  twitchClientId: string;
  twitchClientSecret: string;
}

export const TwitchConfigOpt: ArgumentConfig<TwitchConfig> = {
  twitchClientId: { type: String },
  twitchClientSecret: { type: String },
};

export interface PostgresConfig {
  pgHost: string;
  pgPort: number;
  pgDatabase: string;
  pgUser: string;
  pgPassword: string;
}

export const PostgresConfigOpt: ArgumentConfig<PostgresConfig> = {
  pgHost: { type: String, defaultValue: 'localhost' },
  pgPort: { type: Number, defaultValue: 5432 },
  pgDatabase: { type: String },
  pgUser: { type: String, defaultValue: 'postgres' },
  pgPassword: { type: String },
};

export interface FileConfig {
  config?: string;
}

export const FileConfigOpt: ArgumentConfig<FileConfig> = {
  config: { type: String, optional: true },
};

export interface LogConfig {
  logLevel: string;
}

export const LogConfigOpt: ArgumentConfig<LogConfig> = {
  logLevel: { type: String, defaultValue: 'info' },
};
