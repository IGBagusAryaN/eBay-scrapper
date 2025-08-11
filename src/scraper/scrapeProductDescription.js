import puppeteer from "puppeteer";

export default async function scrapeProductDescription(link) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    await page.goto(link, { waitUntil: "domcontentloaded", timeout: 60000 });

    let descriptionText = "";

    // Klik tab "Description" kalau ada
    try {
      const descTabSelector = 'li[role="tab"] a[aria-controls*="desc_tab"]';
      if (await page.$(descTabSelector)) {
        await page.click(descTabSelector);
        await page.waitForTimeout(2000);
      }
    } catch {}

    // Coba ambil dari iframe
    try {
      await page.waitForSelector('iframe[src*="ebaydesc"]', { timeout: 8000 });
      const iframeHandle = await page.$('iframe[src*="ebaydesc"]');
      const frame = await iframeHandle.contentFrame();
      if (frame) {
        await frame.waitForSelector("body", { timeout: 8000 });
        descriptionText = await frame.$eval("body", el =>
          el.innerText.replace(/\s+/g, " ").trim()
        );
      }
    } catch {}

    // Fallback: ambil langsung dari container seller description
    if (!descriptionText) {
      const possibleSelectors = [
        'div[data-testid="x-item-description"]',
        "#desc_div",
      ];
      for (const sel of possibleSelectors) {
        try {
          await page.waitForSelector(sel, { timeout: 5000 });
          descriptionText = await page.$eval(sel, el =>
            el.innerText.replace(/\s+/g, " ").trim()
          );
          if (descriptionText) break;
        } catch {}
      }
    }

    return descriptionText || "No seller description available";
  } catch (err) {
    console.error("Desc error:", err.message);
    return "No seller description available";
  } finally {
    if (browser) await browser.close();
  }
}
