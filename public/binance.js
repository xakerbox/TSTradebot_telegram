"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceInfo = void 0;
const node_binance_api_1 = __importDefault(require("node-binance-api"));
require("dotenv").config();
const binanceLong = new node_binance_api_1.default().options({
    APIKEY: process.env.BINANCE_API_KEY_LONG,
    APISECRET: process.env.BINANCE_API_SECRET_LONG,
});
const binanceShort = new node_binance_api_1.default().options({
    APIKEY: process.env.BINANCE_API_KEY_SHORT,
    APISECRET: process.env.BINANCE_API_SECRET_SHORT,
});
class BinanceInfo {
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const resultLong = yield (binanceLong.futuresBalance());
            const cleanResLong = resultLong.filter((el) => (el.asset = "USDT" && +el.balance > 10));
            const [filteredResultLong] = cleanResLong.map((el) => {
                return {
                    balance: Math.round(+el.balance * 100) / 100,
                    pnl: Math.round(+el.crossUnPnl * 100) / 100,
                };
            });
            const resultShort = yield (binanceShort.futuresBalance());
            const cleanResShort = resultShort.filter((el) => (el.asset = "USDT" && +el.balance > 10));
            const [filteredResultShort] = cleanResShort.map((el) => {
                return {
                    balance: Math.round(+el.balance * 100) / 100,
                    pnl: Math.round(+el.crossUnPnl * 100) / 100,
                };
            });
            return { short: filteredResultShort, long: filteredResultLong };
        });
    }
    getPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { positions: rawPositionsShort } = yield (binanceShort.futuresAccount());
            const filteredShort = rawPositionsShort.filter((el) => +el.positionAmt < 0);
            const responseShort = filteredShort.map((el) => {
                return {
                    symbol: el.symbol,
                    pnl: Math.round(+el.unrealizedProfit * 100) / 100,
                    qty: Math.round(+el.positionAmt * 100) / 100,
                    notional: Math.round(+el.notional * 100) / 100,
                };
            });
            const { positions: rawPositionsLong } = yield (binanceLong.futuresAccount());
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
        });
    }
}
exports.BinanceInfo = BinanceInfo;
