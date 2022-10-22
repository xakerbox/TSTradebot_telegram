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
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
require("dotenv").config();
const binance_1 = require("./binance");
const token = process.env.TELEGRAM_TOKEN;
const chatIds = [165564370, 535043367]; // 535043367
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
const binance = new binance_1.BinanceInfo();
const keyboard = [
    {
        text: "BALANCE",
    },
    {
        text: "POSITIONS",
    },
];
const keyboardFull = {
    keyboard: [keyboard],
};
bot.setMyCommands([
    {
        command: "/start",
        description: "Вам шортика или лонгочка, мсье?",
    },
]);
bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendMessage(msg.chat.id, "Road to the billion\nТыцяй кнопочку.", {
        reply_markup: keyboardFull,
        parse_mode: "HTML",
        disable_web_page_preview: true,
    });
}));
bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.text === "BALANCE") {
        const balances = yield binance.getBalance();
        const message = `
  SHORT:\n   Баланс: $${balances.short.balance}\n   PNL: $${balances.short.pnl}
LONG:\n   Баланс: $${balances.long.balance}\n   PNL: $${balances.long.pnl}\n
Суммарный баланс: $${balances.short.balance + balances.long.balance}.
  `;
        bot.sendMessage(msg.chat.id, message);
    }
    if (msg.text === 'POSITIONS') {
        const positions = yield binance.getPositions();
        console.log(positions);
        const longMess = positions.long.map(el => {
            return `   ${el.qty, el.symbol}: summ $${el.notional}, pnl: $${el.pnl}\n`;
        });
        const shortMess = positions.short.map(el => {
            return `   ${el.qty, el.symbol}: summ $${el.notional}, pnl: $${el.pnl}\n`;
        });
        const message = `
SHORT: \n${shortMess}
LONG: \n${longMess}
  `;
        bot.sendMessage(msg.chat.id, message);
    }
}));
