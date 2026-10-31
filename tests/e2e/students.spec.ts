import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

test.describe("Student Management E2E Lifecycle", () => {
  test.beforeEach(async () => {
    const prisma = new PrismaClient();
    await prisma.student.deleteMany({
      where: {
        OR: [{ firstName: "Dorothy" }, { lastName: "Vaughan" }],
      },
    });
    await prisma.$disconnect();
  });

  test("complete lifecycle: add, search, view ID card, edit, and delete student", async ({
    page,
  }) => {
    const uniqueEmail = `dorothy.${Date.now()}@example.edu`;

    // 1. Visit the app
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Student Register", level: 1 })
    ).toBeVisible();

    // 2. Open Add Student drawer
    await page.getByRole("button", { name: "Add student" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Add student record" })
    ).toBeVisible();

    // 3. Fill the form
    await page.getByLabel("First name").fill("Dorothy");
    await page.getByLabel("Last name").fill("Vaughan");
    await page.getByLabel("Email address").fill(uniqueEmail);
    await page.getByLabel("Phone number").fill("+1 555-0199");
    await page.getByLabel("Course", { exact: true }).selectOption({ index: 0 });
    await page.getByLabel("Year of study").selectOption({ value: "3" });
    await page.getByLabel("Cumulative GPA").fill("3.90");

    // 4. Submit form
    await page.getByRole("button", { name: "Add student" }).last().click();

    // 5. Verify status toast appears
    await expect(page.getByRole("status")).toContainText("Added Dorothy Vaughan");

    // 6. Search for the newly added student
    const searchInput = page.getByRole("searchbox", { name: "Search students" });
    await searchInput.fill("Dorothy");

    // Wait for debounce and row to appear
    const studentBtn = page.getByRole("button", { name: /Dorothy Vaughan/i }).first();
    await expect(studentBtn).toBeVisible();

    // 7. Click student name to open signature Student ID card
    await studentBtn.click();
    await expect(
      page.getByText("Official Student Credential")
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Dorothy Vaughan" })
    ).toBeVisible();

    // 8. Click Edit from ID card
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit student record" })
    ).toBeVisible();

    // 9. Update GPA and save
    const gpaInput = page.getByLabel("Cumulative GPA");
    await gpaInput.fill("3.95");
    await page.getByRole("button", { name: "Save student" }).click();

    // 10. Verify saved toast
    await expect(page.getByRole("status")).toContainText("Saved Dorothy Vaughan");

    // 11. Delete student with confirmation
    const deleteBtn = page.getByRole("button", { name: "Delete Dorothy Vaughan" }).first();
    await deleteBtn.click();

    // Confirm dialog must name the student and state consequences
    await expect(
      page.getByRole("heading", { name: "Delete student record" })
    ).toBeVisible();
    await expect(
      page.getByText(/Dorothy Vaughan.*will be removed from the register/i)
    ).toBeVisible();

    // Confirm deletion
    await page.getByRole("button", { name: "Delete student" }).click();

    // 12. Verify deletion toast and removal from list
    await expect(page.getByRole("status")).toContainText("Deleted Dorothy Vaughan");
    await expect(page.getByRole("button", { name: /Dorothy Vaughan/i })).toHaveCount(0);
  });
});
