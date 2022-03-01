const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const {randomChoice, getRandomInt} = require("./helper");
puppeteer.use(StealthPlugin())

const meta = {
  'Article': ['sport', 'world', 'russia', 'ussr', 'business', 'science', 'nopolitics']
}

const run = async (browser) => {
  const page = await browser.newPage();

  const url = `https://russian.rt.com/listing/type.Article.category.${randomChoice(meta['Article'])}/prepare/all-news/${getRandomInt(500, 980)}/0`

  return new Promise(async (resolve) => {
    let fail = 0;
    page.on('response', async (response) => {
      if (response.url() === url) {
        if (response.status() === 200) {
          console.log('success');
          await page.waitForNetworkIdle();
          await page.waitForTimeout(5000);
          await page.close();
          resolve()
        } else {
          console.log('fail');
          fail += 1
          if (fail === 2) {
           page.close();
            resolve()
          }
        }
      }
    });
    await page.goto(url, {
      timeout: 60000
    });
  })
}

puppeteer.launch({
  headless: false
}).then(async browser => {
  let tabs = 2;
  const args = process.argv.slice(2);
  if (args[0]) {
    tabs = Number(args[0])
  }

  while (true) {
    await Promise.all(Array(tabs).fill(1).map(v => run(browser)));
  }
})
