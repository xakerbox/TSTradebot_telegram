import TelegramBot, {
  ReplyKeyboardMarkup,
  KeyboardButton,
} from "node-telegram-bot-api";
require("dotenv").config();
import { BinanceInfo } from "./binance";

const token = process.env.TELEGRAM_TOKEN;

const chatIds = [165564370, 535043367]; // 535043367
const bot = new TelegramBot(token, { polling: true });
const binance = new BinanceInfo();

const keyboard: KeyboardButton[] = [
  {
    text: "BALANCE",
  },
  {
    text: "POSITIONS",
  },
];

const keyboardFull: ReplyKeyboardMarkup = {
  keyboard: [keyboard],
};

bot.setMyCommands([
  {
    command: "/start",
    description: "Вам шортика или лонгочка, мсье?",
  },
]);

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(msg.chat.id, "Road to the billion\nТыцяй кнопочку.", {
    reply_markup: keyboardFull,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
});

bot.on("message", async (msg) => {
  if (msg.text === "BALANCE") {
    const balances = await binance.getBalance();
    const message = `
  SHORT:\n   Баланс: $${balances.short.balance}\n   PNL: $${balances.short.pnl}
LONG:\n   Баланс: $${balances.long.balance}\n   PNL: $${balances.long.pnl}\n
Суммарный баланс: $${balances.short.balance + balances.long.balance}.
  `;
    bot.sendMessage(msg.chat.id, message);
  }

  if (msg.text === "POSITIONS") {
    const positions = await binance.getPositions();
    console.log(positions);
    const longMess = positions.long.map((el) => {
      return `   ${(el.qty, el.symbol)}: summ $${el.notional}, pnl: $${
        el.pnl
      }\n`;
    });
    const shortMess = positions.short.map((el) => {
      return `   ${(el.qty, el.symbol)}: summ $${el.notional}, pnl: $${
        el.pnl
      }\n`;
    });
    const message = `
SHORT: \n${shortMess}
LONG: \n${longMess}
  `;
    bot.sendMessage(msg.chat.id, message);
  }
});
