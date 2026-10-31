/* eslint-disable no-console */
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

async function main() {
  const screenshotsDir = path.resolve(process.cwd(), "docs/screenshots");
  const artifactScreenshotsDir =
    "C:\\Users\\ousse\\.gemini\\antigravity\\brain\\efaf9400-47be-4cee-a3be-41f912e4545f\\screenshots";

  fs.mkdirSync(screenshotsDir, { recursive: true });
  fs.mkdirSync(artifactScreenshotsDir, { recursive: true });

  const browser = await chromium.launch();
  const viewports = [
    { name: "desktop-1440px", width: 1440, height: 900 },
    { name: "tablet-768px", width: 768, height: 1024 },
    { name: "mobile-390px", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

    // 1. Populated list view
    const listPath = path.join(screenshotsDir, `list-${vp.name}.png`);
    await page.screenshot({ path: listPath, fullPage: false });
    fs.copyFileSync(listPath, path.join(artifactScreenshotsDir, `list-${vp.name}.png`));
    console.log(`Captured list-${vp.name}.png`);

    // 2. Open Add drawer
    await page.getByRole("button", { name: "Add student" }).first().click();
    await page.waitForTimeout(400); // wait for slide-in animation
    const drawerPath = path.join(screenshotsDir, `drawer-${vp.name}.png`);
    await page.screenshot({ path: drawerPath, fullPage: false });
    fs.copyFileSync(drawerPath, path.join(artifactScreenshotsDir, `drawer-${vp.name}.png`));
    console.log(`Captured drawer-${vp.name}.png`);

    // Close drawer
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.waitForTimeout(300);

    // 3. Open ID Card (signature element)
    const firstStudentBtn = page.getByRole("button", { name: /Amira Ben Salah/i }).first();
    if (await firstStudentBtn.isVisible()) {
      await firstStudentBtn.click();
      await page.waitForTimeout(400); // modal animation
      const idCardPath = path.join(screenshotsDir, `idcard-${vp.name}.png`);
      await page.screenshot({ path: idCardPath, fullPage: false });
      fs.copyFileSync(idCardPath, path.join(artifactScreenshotsDir, `idcard-${vp.name}.png`));
      console.log(`Captured idcard-${vp.name}.png`);

      // Close ID card
      await page.getByRole("button", { name: "Close" }).click();
      await page.waitForTimeout(300);
    }

    // 4. Open Confirm Delete Dialog
    const firstDeleteBtn = page.getByRole("button", { name: /Delete Amira Ben Salah/i }).first();
    if (await firstDeleteBtn.isVisible()) {
      await firstDeleteBtn.click();
      await page.waitForTimeout(400);
      const deletePath = path.join(screenshotsDir, `delete-${vp.name}.png`);
      await page.screenshot({ path: deletePath, fullPage: false });
      fs.copyFileSync(deletePath, path.join(artifactScreenshotsDir, `delete-${vp.name}.png`));
      console.log(`Captured delete-${vp.name}.png`);

      await page.getByRole("button", { name: "Keep student" }).click();
      await page.waitForTimeout(300);
    }

    await page.close();
  }

  await browser.close();
  console.log("All multi-viewport screenshots captured successfully.");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
