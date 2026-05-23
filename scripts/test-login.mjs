/**
 * Prueba flujo de login en producción o local.
 * Uso: node scripts/test-login.mjs https://thepiolo.icu email password
 */
import puppeteer from "puppeteer-core";

const baseUrl = process.argv[2] || "https://thepiolo.icu";
const email = process.argv[3];
const password = process.argv[4];

const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => logs.push(`[console] ${msg.text()}`));

try {
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle2", timeout: 60000 });
  const title = await page.title();
  console.log("Login page title:", title);

  if (email && password) {
    await page.type('input[name="email"]', email, { delay: 20 });
    await page.type('input[name="password"]', password, { delay: 20 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 2000));
  }

  const finalUrl = page.url();
  const bodySnippet = await page.evaluate(() => document.body.innerText.slice(0, 300));

  console.log("\nFinal URL:", finalUrl);
  console.log("On /admin?", finalUrl.includes("/admin") && !finalUrl.includes("/login"));
  console.log("Body preview:", bodySnippet.replace(/\s+/g, " ").trim());

  const cookies = await page.cookies();
  const session = cookies.filter((c) => c.name.includes("authjs"));
  console.log(
    "Session cookies:",
    session.map((c) => `${c.name} (secure=${c.secure})`).join(", ") || "none",
  );

  if (logs.length) console.log("\nConsole:\n", logs.join("\n"));
} catch (e) {
  console.error("Test failed:", e.message);
} finally {
  await browser.close();
}
