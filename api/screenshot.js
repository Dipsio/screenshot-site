const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  let browser = null;

  try {
    const executablePath = await chromium.executablePath || "/usr/bin/chromium-browser";

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://wpexperts.io", {
      waitUntil: "networkidle2",
    });

    const screenshot = await page.screenshot({ type: "png" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(screenshot);
  } catch (err) {
    console.error("❌ Ошибка генерации скриншота:", err);
    if (browser) await browser.close();
    res.status(500).send("❌ Ошибка при генерации скриншота");
  }
};