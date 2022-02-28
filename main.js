const fs = require("fs");

const {chromium} = require('playwright-chromium');

const randomChoice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const RESOURCE_EXCLUSTIONS = ['image', 'media', 'font', 'other'];

(async () => {
  const words = fs.readFileSync('stop_words_russian.txt', 'utf-8').split('\n');
  const browser = await chromium.launch(
    {
      headless: false
    }
  );

  while (true) {
    const page = await browser.newPage();

    await page.route('**/*', (route) => {
      return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
        ? route.abort()
        : route.continue()
    });


    await page.goto('https://russian.rt.com');

    await page.click('div.search__submit-top');
    const searchTerm = Array(getRandomInt(2, 6)).fill(1).map(val => randomChoice(words)).join(' ')

    // const uri = `https://russian.rt.com/search?q=${searchTerm}`;
    // const encoded = encodeURI(uri).replaceAll('%20', '+');

    // page.waitForResponse(async (response) => {
    //   if (response.url() === encoded && response.status() === 200) {
    //     console.log('success', response.url());
    //   }
    // });

    await page.type('#search_input_field-top', searchTerm, {delay: 100});
    await page.press('#search_input_field-top', 'Enter');

    await page.waitForLoadState();
    await page.close();
  }
})();
