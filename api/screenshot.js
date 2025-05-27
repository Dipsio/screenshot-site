// api/screenshot.js
const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

module.exports = async function handler(req, res) {
  const url = req.query.url

  if (!url || !/^https?:\/\//.test(url)) {
    res.status(400).json({ error: 'Invalid URL' })
    return
  }

  let browser = null
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    const screenshot = await page.screenshot({ type: 'png' })

    res.setHeader('Content-Type', 'image/png')
    res.status(200).send(screenshot)
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  } finally {
    if (browser) await browser.close()
  }
}
