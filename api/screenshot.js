const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://stockcharts.com/h-sc/ui?s=$CPCE&p=D&yr=1&mn=0&dy=0&id=p77689813562&a=500931902", {
      waitUntil: "networkidle2",
    });

    const screenshot = await page.screenshot({ type: "png" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).send(screenshot);
  } catch (err) {
    console.error("Ошибка Puppeteer:", err);
    if (browser) await browser.close();
    res.status(500).send("Ошибка при генерации скриншота");
  }
};