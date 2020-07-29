//supported by Telegraf from npmjs.com
require("dotenv").config();
const Telegraf = require("telegraf");
const api = require("covid19-api");
const Markup = require("telegraf/markup");
const COUNTRIES_LIST = require("./constants");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Привет, ${ctx.message.from.first_name}!
Хочешь узнать статистику по Коронавирусу на данный момент?
Введи на английском название страны и получи её!
Посмотреть весь список стран можно командой /help.
`,
    Markup.keyboard([
      ["US", "Russia"],
      ["Ukraine", "Kazakhstan"],
    ])
      .resize()
      .extra()
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on("text", async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);

    let formatData = `
    Страна:   ${data[0][0].country}
    Случаи:   ${data[0][0].cases}
    Смертей:  ${data[0][0].deaths}
    Выздоровело:   ${data[0][0].recovered}
    `;
    ctx.reply(formatData);
  } catch {
    console.log("ошибка");
    ctx.reply("Ошибка, такой страны нет");
  }
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
console.log("Бот запущен");
