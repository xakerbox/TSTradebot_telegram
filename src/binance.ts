import Binance from "node-binance-api";
import {
  FuturesBalance,
  FuturesBalanceFiltered,
  Positions,
  PositionsFiltered,
} from "./interfaces/binance";
require("dotenv").config();

const binanceLong = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY_LONG,
  APISECRET: process.env.BINANCE_API_SECRET_LONG,
});

const binanceShort = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY_SHORT,
  APISECRET: process.env.BINANCE_API_SECRET_SHORT,
});

export class BinanceInfo {
  async getBalance(): Promise<FuturesBalanceFiltered> {
    const resultLong = await (<Promise<FuturesBalance[]>>(
      binanceLong.futuresBalance()
    ));
    const cleanResLong = resultLong.filter(
      (el) => (el.asset = "USDT" && +el.balance > 10)
    );

    const [filteredResultLong] = cleanResLong.map((el) => {
      return {
        balance: Math.round(+el.balance * 100) / 100,
        pnl: Math.round(+el.crossUnPnl * 100) / 100,
      };
    });

    const resultShort = await (<Promise<FuturesBalance[]>>(
      binanceShort.futuresBalance()
    ));
    const cleanResShort = resultShort.filter(
      (el) => (el.asset = "USDT" && +el.balance > 10)
    );

    const [filteredResultShort] = cleanResShort.map((el) => {
      return {
        balance: Math.round(+el.balance * 100) / 100,
        pnl: Math.round(+el.crossUnPnl * 100) / 100,
      };
    });

    return { short: filteredResultShort, long: filteredResultLong };
  }

  async getPositions(): Promise<PositionsFiltered> {
    const { positions: rawPositionsShort } = await (<Promise<Positions>>(
      binanceShort.futuresAccount()
    ));
    const filteredShort = rawPositionsShort.filter((el) => +el.positionAmt < 0);
    const responseShort = filteredShort.map((el) => {
      return {
        symbol: el.symbol,
        pnl: Math.round(+el.unrealizedProfit * 100) / 100,
        qty: Math.round(+el.positionAmt * 100) / 100,
        notional: Math.round(+el.notional * 100) / 100,
      };
    });

    const { positions: rawPositionsLong } = await (<Promise<Positions>>(
      binanceLong.futuresAccount()
    ));
    const filteredLong = rawPositionsLong.filter((el) => +el.positionAmt > 0);
    const responseLong = filteredLong.map((el) => {
      return {
        symbol: el.symbol,
        pnl: Math.round(+el.unrealizedProfit * 100) / 100,
        qty: Math.round(+el.positionAmt * 100) / 100,
        notional: Math.round(+el.notional * 100) / 100,
      };
    });

    return {
      short: responseShort.sort((a, b) => b.pnl - a.pnl),
      long: responseLong.sort((a, b) => b.pnl - a.pnl),
    };
  }
}
