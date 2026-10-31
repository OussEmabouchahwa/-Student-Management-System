import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentTable } from "./StudentTable";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Student } from "../types";

const mockStudents: Student[] = [
  {
    id: "s-1",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.edu",
    phone: "+1 555-0101",
    course: "Computer Science",
    year: 4,
    gpa: 3.95,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "s-2",
    firstName: "Alan",
    lastName: "Turing",
    email: "alan@example.edu",
    phone: null,
    course: "Mathematics",
    year: 3,
    gpa: 3.8,
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
];

describe("StudentTable", () => {
  it("renders student names as buttons and displays details", () => {
    const handleView = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <StudentTable
        students={mockStudents}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    // Names are buttons
    const adaButtons = screen.getAllByRole("button", { name: /Ada Lovelace/i });
    expect(adaButtons.length).toBeGreaterThan(0);

    // Verify course and year
    expect(screen.getAllByText("Computer Science").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Year 4").length).toBeGreaterThan(0);

    // Verify accessible action buttons
    const editAda = screen.getAllByRole("button", { name: "Edit Ada Lovelace" });
    expect(editAda.length).toBeGreaterThan(0);

    const deleteAda = screen.getAllByRole("button", { name: "Delete Ada Lovelace" });
    expect(deleteAda.length).toBeGreaterThan(0);
  });

  it("calls onView when student name is clicked", async () => {
    const user = userEvent.setup();
    const handleView = vi.fn();

    render(
      <StudentTable
        students={mockStudents}
        onView={handleView}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const adaButtons = screen.getAllByRole("button", { name: /Ada Lovelace/i });
    await user.click(adaButtons[0]);

    expect(handleView).toHaveBeenCalledWith(mockStudents[0]);
  });

  it("highlights search matches with mark element", () => {
    render(
      <StudentTable
        students={mockStudents}
        searchQuery="Ada"
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Check for <mark> containing "Ada"
    const marks = screen.getAllByText("Ada", { selector: "mark" });
    expect(marks.length).toBeGreaterThan(0);
  });
});

describe("EmptyState", () => {
  it("renders no-data state with Add student action", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(<EmptyState variant="no-data" onAction={handleAction} />);

    expect(
      screen.getByRole("heading", { name: "No students in the register" })
    ).toBeInTheDocument();

    const actionButton = screen.getByRole("button", { name: "+ Add student" });
    await user.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("renders no-matches state with Clear filters action", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(<EmptyState variant="no-matches" onAction={handleAction} />);

    expect(
      screen.getByRole("heading", { name: "No students match your search" })
    ).toBeInTheDocument();

    const actionButton = screen.getByRole("button", { name: "Clear filters" });
    await user.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

describe("ConfirmDialog", () => {
  it("names the student and states the consequence", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        studentName="Ada Lovelace"
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText("Delete student record")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(
      screen.getByText(/will be removed from the register\. This can't be undone\./i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Keep student" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete student" })).toBeInTheDocument();
  });

  it("calls onConfirm when Delete student is clicked", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        studentName="Ada Lovelace"
        onConfirm={handleConfirm}
      />
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete student" });
    await user.click(deleteBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
