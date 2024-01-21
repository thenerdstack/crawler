const express = require('express');
const { chromium } = require('playwright');

class Scraper {
  async runScraping(url) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(url);
      const content = await page.$eval('body', (element) => element.innerText);
      return content;
    } finally {
      await browser.close();
    }
  }
}

const app = express();
app.use(express.json());

const scraper = new Scraper();

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  try {
    const content = await scraper.runScraping(url);
    res.json({ url, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
