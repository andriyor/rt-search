const {chromium} = require('playwright-chromium');

const run = async (browser) => {
  const page = await browser.newPage();

  await page.goto('https://russian.rt.com/listing/type.News.tag.novosty-glavnoe/prepare/all-news/999/0');

  return new Promise(resolve => {
    page.on('response', async (response) => {
      if (response.url() === 'https://russian.rt.com/listing/type.News.tag.novosty-glavnoe/prepare/all-news/999/0' && response.status() === 200) {
        console.log('success');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        await page.close();
        resolve()
      }
    });
  })
}

(async () => {
  const browser = await chromium.launch(
    {
      headless: false
    }
  );

  while (true) {
    await Promise.all([run(browser), run(browser)]);
  }
})();
