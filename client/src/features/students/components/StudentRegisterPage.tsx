import { useState } from "react";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { TableSkeletonRows } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Pagination } from "../../../components/ui/Pagination";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { StudentFilters } from "./StudentFilters";
import { StudentTable } from "./StudentTable";
import { StudentFormDrawer } from "./StudentFormDrawer";
import { StudentIdCard } from "./StudentIdCard";
import { useStudentFilters } from "../hooks/useStudentFilters";
import { useCourses, useStudents } from "../hooks/useStudents";
import { useStudentMutations } from "../hooks/useStudentMutations";
import { Student } from "../types";

export function StudentRegisterPage() {
  const { filters, setFilters, resetFilters } = useStudentFilters();
  const { data, isLoading, isError, refetch } = useStudents(filters);
  const { data: courses = [] } = useCourses();
  const { deleteStudent } = useStudentMutations();

  // Overlay state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [viewedStudent, setViewedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const totalCount = data?.meta.total ?? 0;
  const courseCount = courses.length;

  const handleOpenAdd = () => {
    setSelectedStudentForEdit(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudentForEdit(student);
    setDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent.mutateAsync({
        id: studentToDelete.id,
        studentName: `${studentToDelete.firstName} ${studentToDelete.lastName}`,
      });
      setStudentToDelete(null);
    } catch {
      // Error is caught and surfaced via toast or mutation status
    }
  };

  const hasActiveFilters = !!filters.q || !!filters.course;

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-8 md:px-8">
      {/* Header section */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-rule pb-6">
        <div>
          <h1 className="font-serif text-[clamp(2.4rem,5.5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.015em] text-ink">
            Student Register
          </h1>
          <p className="mt-2 text-base text-ink-2 font-normal">
            {isLoading ? (
              <span className="inline-block w-40 h-4 bg-rule/50 rounded animate-pulse" />
            ) : (
              <span>
                <strong className="font-bold text-ink tabular-nums">{totalCount}</strong>{" "}
                {totalCount === 1 ? "student" : "students"} across{" "}
                <strong className="font-bold text-ink tabular-nums">{courseCount}</strong>{" "}
                {courseCount === 1 ? "course" : "courses"}
              </span>
            )}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shrink-0 self-start sm:self-end"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add student</span>
        </Button>
      </header>

      {/* Filter controls */}
      <div className="mb-6">
        <StudentFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Content states */}
      <main>
        {isLoading ? (
          <div className="rounded-lg border border-rule bg-paper">
            <TableSkeletonRows rows={6} />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-rule bg-paper p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger mb-4">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink mb-1">
              Failed to load students
            </h2>
            <p className="max-w-md text-ink-2 text-base mb-6">
              There was a problem connecting to the registry service. Please verify your connection and try again.
            </p>
            <Button variant="secondary" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : totalCount === 0 ? (
          hasActiveFilters ? (
            <EmptyState variant="no-matches" onAction={resetFilters} />
          ) : (
            <EmptyState variant="no-data" onAction={handleOpenAdd} />
          )
        ) : (
          <div className="space-y-4">
            <StudentTable
              students={data?.data ?? []}
              searchQuery={filters.q}
              onView={(s) => setViewedStudent(s)}
              onEdit={handleOpenEdit}
              onDelete={(s) => setStudentToDelete(s)}
            />

            <Pagination
              page={data?.meta.page ?? 1}
              limit={data?.meta.limit ?? 10}
              total={data?.meta.total ?? 0}
              totalPages={data?.meta.totalPages ?? 1}
              onPageChange={(page) => setFilters({ page })}
            />
          </div>
        )}
      </main>

      {/* Overlays */}
      <StudentFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        student={selectedStudentForEdit}
      />

      <StudentIdCard
        open={!!viewedStudent}
        onClose={() => setViewedStudent(null)}
        student={viewedStudent}
        onEdit={(s) => {
          setViewedStudent(null);
          handleOpenEdit(s);
        }}
        onDelete={(s) => {
          setViewedStudent(null);
          setStudentToDelete(s);
        }}
      />

      <ConfirmDialog
        open={!!studentToDelete}
        onOpenChange={(open) => {
          if (!open) setStudentToDelete(null);
        }}
        studentName={
          studentToDelete
            ? `${studentToDelete.firstName} ${studentToDelete.lastName}`
            : ""
        }
        isLoading={deleteStudent.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
