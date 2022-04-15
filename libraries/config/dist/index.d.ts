import type { ArgumentConfig } from "ts-command-line-args";
export interface KafkaConfig {
    kafkaClientId: string;
    kafkaBroker: string[];
}
export declare const KafkaConfigOpt: ArgumentConfig<KafkaConfig>;
export interface PostgresConfig {
    pgHost: string;
    pgPort: number;
    pgDatabase: string;
    pgUser: string;
    pgPassword: string;
}
export declare const PostgresConfigOpt: ArgumentConfig<PostgresConfig>;
export interface FileConfig {
    config?: string;
}
export declare const FileConfigOpt: ArgumentConfig<FileConfig>;
export interface LogConfig {
    logLevel: string;
}
export declare const LogConfigOpt: ArgumentConfig<LogConfig>;
