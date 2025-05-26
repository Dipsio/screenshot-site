const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  let browser = null;

  try {
    const executablePath = await chromium.executablePath;

    if (!executablePath) {
      throw new Error("Chromium executable not found");
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      headless: chromium.headless,
      defaultViewport: { width: 1280, height: 720 },
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
    console.error("❌ Puppeteer Error:", err.message);
    if (browser) await browser.close();
    res.status(500).send("Ошибка генерации скриншота");
  }
};
