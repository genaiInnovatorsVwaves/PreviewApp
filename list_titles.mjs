import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 2400 } });

const platforms = ["NSI", "OSI", "ESI", "NSM", "OSM", "ESM"];
const result = {};
for (const p of platforms) {
  await page.goto(`http://localhost:5183/${p}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const titles = await page.locator("h3").allTextContents();
  result[p] = titles.slice(0, 16);
}
console.log(JSON.stringify(result, null, 2));
await browser.close();
