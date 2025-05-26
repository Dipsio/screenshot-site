const chromium = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  let browser = null;

  try {
    const executablePath = await chromium.executablePath;

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://stockcharts.com/h-sc/ui?s=$CPCE&p=D&yr=1&mn=0&dy=0&id=p77689813562&a=500931902", {
      waitUntil: "networkidle2",
    });

    const screenshot = await page.screenshot({ type: "png" });

    await browser.close();
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(screenshot);
  } catch (err) {
    console.error("❌ Puppeteer error:", err.message);
    if (browser) await browser.close();
    res.status(500).send("Ошибка скриншота: " + err.message);
  }
};
