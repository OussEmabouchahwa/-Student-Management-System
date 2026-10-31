import { test } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

test.describe("Design System Review Screenshots", () => {
  const screenshotsDir = path.resolve(process.cwd(), "docs/screenshots");
  const artifactScreenshotsDir =
    "C:\\Users\\ousse\\.gemini\\antigravity\\brain\\efaf9400-47be-4cee-a3be-41f912e4545f\\screenshots";

  test.beforeAll(() => {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    fs.mkdirSync(artifactScreenshotsDir, { recursive: true });
  });

  const viewports = [
    { name: "desktop-1440px", width: 1440, height: 900 },
    { name: "tablet-768px", width: 768, height: 1024 },
    { name: "mobile-390px", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    test(`capture states at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // 1. Populated list view
      const listPath = path.join(screenshotsDir, `list-${vp.name}.png`);
      await page.screenshot({ path: listPath });
      fs.copyFileSync(listPath, path.join(artifactScreenshotsDir, `list-${vp.name}.png`));

      // 2. Add Drawer
      await page.getByRole("button", { name: "Add student" }).first().click();
      await page.waitForTimeout(400);
      const drawerPath = path.join(screenshotsDir, `drawer-${vp.name}.png`);
      await page.screenshot({ path: drawerPath });
      fs.copyFileSync(drawerPath, path.join(artifactScreenshotsDir, `drawer-${vp.name}.png`));

      // Close drawer
      await page.getByRole("button", { name: "Cancel" }).click();
      await page.waitForTimeout(350);

      // 3. Signature Student ID Card
      // Select first visible student name button
      const studentBtn = page.locator("button.font-serif:visible").first();
      await studentBtn.waitFor({ state: "visible" });
      await studentBtn.click();
      await page.waitForTimeout(400);

      const idCardPath = path.join(screenshotsDir, `idcard-${vp.name}.png`);
      await page.screenshot({ path: idCardPath });
      fs.copyFileSync(idCardPath, path.join(artifactScreenshotsDir, `idcard-${vp.name}.png`));

      // Close ID card
      await page.getByRole("button", { name: "Close" }).click();
      await page.waitForTimeout(350);

      // 4. Confirm Delete Dialog
      const deleteBtn = page.locator("button[aria-label^='Delete ']:visible").first();
      await deleteBtn.waitFor({ state: "visible" });
      await deleteBtn.click();
      await page.waitForTimeout(400);

      const deletePath = path.join(screenshotsDir, `delete-${vp.name}.png`);
      await page.screenshot({ path: deletePath });
      fs.copyFileSync(deletePath, path.join(artifactScreenshotsDir, `delete-${vp.name}.png`));

      await page.getByRole("button", { name: "Keep student" }).click();
      await page.waitForTimeout(350);
    });
  }
});
