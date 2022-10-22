declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BINANCE_API_KEY_LONG: string;
      BINANCE_API_SECRET_LONG: string;
      BINANCE_API_KEY_SHORT: string;
      BINANCE_API_SECRET_SHORT: string;
      TELEGRAM_TOKEN: string;
    }
  }
}

export {};