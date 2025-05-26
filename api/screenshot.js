const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const url = "https://wpexperts.io";
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(url, { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res.status(200).send(screenshot);
};
