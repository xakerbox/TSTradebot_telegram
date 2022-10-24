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
var CronJob = require("cron").CronJob;
const binance_1 = require("./binance");
const format_1 = __importDefault(require("date-fns/format"));
const fs_1 = require("fs");
const binance = new binance_1.BinanceInfo();
const writeBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const { short, long } = yield binance.getBalance();
    const balanceToSave = {
        day: (0, format_1.default)(new Date(), "dd"),
        month: (0, format_1.default)(new Date(), "MM"),
        hours: (0, format_1.default)(new Date(), "HH"),
        minutes: (0, format_1.default)(new Date(), "mm"),
        short: short.balance,
        long: long.balance,
    };
    const balancelogger = JSON.parse((0, fs_1.readFileSync)("./public/balancelogger.json", "utf-8"));
    balancelogger.push(balanceToSave);
    console.log("Log is:", balancelogger);
    (0, fs_1.writeFileSync)("./public/balancelogger.json", JSON.stringify(balancelogger), "utf-8");
});
var job = new CronJob("*/2 * * * * *", writeBalance, null, true, "Europe/Kiev");
