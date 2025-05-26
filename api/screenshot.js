const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot();
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(screenshotBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to capture screenshot' });
  }
};