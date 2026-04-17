export const CONFIG = 'CONFIG';

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
  debug?: string;
}

export const configProvider = {
  provide: CONFIG,
  useValue: {
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'mongodb',
      url: process.env.DATABASE_URL ?? '',
    },
    debug: process.env.DEBUG,
  } satisfies AppConfig,
};
