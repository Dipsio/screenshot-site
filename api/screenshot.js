// api/screenshot.ts
import { NowRequest, NowResponse } from '@vercel/node'
import chromium from 'chrome-aws-lambda' // или playwright-aws-lambda

export default async (req: NowRequest, res: NowResponse) => {
  const url = req.query.url as string

  if (!url || !/^https?:\/\//.test(url)) {
    res.status(400).json({ error: 'Invalid URL' })
    return
  }

  let browser = null
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })
    const screenshot = await page.screenshot({ type: 'png' })
    res.setHeader('Content-Type', 'image/png')
    res.send(screenshot)
  } catch (e) {
    res.status(500).json({ error: e.message })
  } finally {
    if (browser) await browser.close()
  }
}
