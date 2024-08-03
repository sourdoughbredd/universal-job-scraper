// htmlFetchingService.js
import puppeteer from "puppeteer";

class HTMLFetchingService {
  async fetchHTML(url) {
    let browser;
    try {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      const content = await page.content();
      return content;
    } catch (error) {
      throw new Error(`Failed to fetch HTML: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

export default HTMLFetchingService;
