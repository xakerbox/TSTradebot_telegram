var CronJob = require("cron").CronJob;
import { BinanceInfo } from "./binance";
import format from "date-fns/format";
import { writeFileSync, readFileSync, appendFileSync } from "fs";
const binance = new BinanceInfo();

const writeBalance = async () => {
  const { short, long } = await binance.getBalance();
  const balanceToSave = {
    day: format(new Date(), "dd"),
    month: format(new Date(), "MM"),
    hours: format(new Date(), "HH"),
    minutes: format(new Date(), "mm"),
    short: short.balance,
    long: long.balance,
  };
  const balancelogger = JSON.parse(
    readFileSync("./public/balancelogger.json", "utf-8")
  );
  balancelogger.push(balanceToSave);
  console.log("Log is:", balancelogger);
  writeFileSync(
    "./public/balancelogger.json",
    JSON.stringify(balancelogger),
    "utf-8"
  );
};

var job = new CronJob("*/2 * * * * *", writeBalance, null, true, "Europe/Kiev");
