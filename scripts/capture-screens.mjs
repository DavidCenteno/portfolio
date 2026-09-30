// Captures showcase screenshots of the live projects (read-only browsing, no form submissions).
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const desktop = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const mobile = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

async function shot(url, viewport, name, prepare) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  if (prepare) await prepare(page);
  const raw = `assets/screens/${name}.png`;
  await page.screenshot({ path: raw });
  const w = viewport.isMobile ? 780 : 1920;
  await sharp(raw).resize({ width: w }).webp({ quality: 84 }).toFile(`public/images/${name}.webp`);
  console.log("captured", name);
  await page.close();
}

const RM = "https://www.tryresumatch.app/";
const UD = "https://undictionarygame.com/";

const scrollTo = (sel) => async (page) => {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), sel);
  await sleep(900);
};
const clickByText = async (page, text) => {
  for (const b of await page.$$("button")) {
    const [t, visible] = await page.evaluate((e) => [e.innerText.trim(), !!e.offsetParent], b);
    if (visible && t.includes(text)) { await b.click(); await sleep(600); return true; }
  }
  return false;
};
// The cookie bar appears after a delay; wait for it and pick the privacy-preserving option.
const declineCookies = async (page) => {
  for (let i = 0; i < 10; i++) {
    if (await clickByText(page, "Decline")) return;
    await sleep(500);
  }
};
const waitForWord = (page) =>
  page.waitForFunction(() => !document.body.innerText.includes("Loading..."), { timeout: 20000 }).catch(() => {});
const playRound = async (page) => {
  await declineCookies(page);
  await clickByText(page, "s play"); // welcome modal: "Let’s play"
  await waitForWord(page);
  await sleep(1200);
};
const howToPlay = async (page) => {
  await playRound(page);
  await declineCookies(page); // first attempt can be blocked by the welcome modal
  await page.click('button[aria-label="How to play"]');
  await sleep(1200);
};

const only = process.argv[2];
if (!only || only === "rm") {
  await shot(RM, desktop, "resumatch-landing");
  await shot(RM, desktop, "resumatch-how", scrollTo("#how"));
  await shot(RM, mobile, "resumatch-mobile");
}
if (!only || only === "ud") {
await shot(UD, desktop, "undictionary-welcome", howToPlay);
await shot(UD, desktop, "undictionary-game", playRound);
await shot(UD, mobile, "undictionary-mobile", playRound);
}

await browser.close();
