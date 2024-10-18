declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_DEBUG: 'true' | 'false';
      APP_DEBUG_FILE: string;
      DRY_RUN: 'true' | 'false';
      DEFAULT_LOCALE: string;

      NODE_ENV: 'development' | 'production';
      DISCORD_BOT_TOKEN: string;
      DISCORD_BOT_ID: string;

      DISCORD_SERVER_ID: string;

      DISCORD_STAFF_ROLE_ID: string;

      DISCORD_TEST_MEMBERS_WHITELIST_ACTIVE: string;
      DISCORD_TEST_MEMBERS_WHITELIST: string;

      DISCORD_BOT_CHANNELS_CATEGORIES_NAME: string;
      DISCORD_BOT_CHANNELS_CATEGORIES_POSITION: string;

      DISCORD_LOG_CHANNEL_ID: string;

      MAX_AWAITING_MEMBERS_BATCH_SIZE: string;
      AWAITING_MEMBERS_BATCH_FREQUENCY: string;

      MAX_TIMEOUT_BATCH_SIZE: string;
      TIMEOUT_BATCH_FREQUENCY: string;
      TIMEOUT_IN_DAYS: string;

      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      DB_HOST: string;
    }
  }
}
export {};
