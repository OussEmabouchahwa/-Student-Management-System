import { Edit2, Trash2 } from "lucide-react";
import { Dialog } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { GpaMeter } from "../../../components/ui/GpaMeter";
import { Student } from "../types";
import {
  formatDate,
  formatStudentNumber,
  getInitials,
} from "../../../lib/format";

export interface StudentIdCardProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentIdCard({
  open,
  onClose,
  student,
  onEdit,
  onDelete,
}: StudentIdCardProps) {
  if (!student) return null;

  const fullName = `${student.firstName} ${student.lastName}`;
  const studentNumber = formatStudentNumber(student.id, student.createdAt);
  const initials = getInitials(student.firstName, student.lastName);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
      className="max-w-[420px] p-0 overflow-hidden rounded-xl border border-rule-strong shadow-card"
      showCloseButton={false}
    >
      <div className="relative flex flex-col bg-paper">
        {/* Navy Header with Lanyard Slot */}
        <div className="relative bg-navy px-6 pt-5 pb-6 text-center select-none">
          {/* Lanyard Cutout Slot */}
          <div
            className="mx-auto mb-3 h-2 w-14 rounded-full bg-ground/80 border border-white/20 shadow-inner"
            aria-hidden="true"
          />

          <p className="text-xs uppercase tracking-widest text-white/70 font-bold">
            Official Student Credential
          </p>
          <p className="font-serif text-lg font-semibold text-white tracking-wide mt-0.5">
            Student Register
          </p>
        </div>

        {/* Card Body */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex flex-col items-center text-center">
            {/* Marker-Yellow Portrait Block with Serif Initials */}
            <div
              className="flex h-24 w-24 items-center justify-center rounded-xl bg-marker text-ink shadow-sm ring-4 ring-ground"
              aria-hidden="true"
            >
              <span className="font-serif text-4xl font-bold tracking-tight">
                {initials}
              </span>
            </div>

            {/* Student Name & Number */}
            <h2 className="mt-4 font-serif text-2xl font-bold text-ink">
              {fullName}
            </h2>

            <div className="mt-1 inline-flex items-center rounded-sm bg-ground px-2.5 py-0.5 font-mono text-xs font-bold text-ink-2 tabular-nums">
              ID: {studentNumber}
            </div>
          </div>

          {/* Two-Column Definition Grid */}
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-rule pt-5 text-sm">
            <div>
              <dt className="text-xs font-normal text-ink-2">Course</dt>
              <dd className="font-bold text-ink truncate">{student.course}</dd>
            </div>

            <div>
              <dt className="text-xs font-normal text-ink-2">Year of study</dt>
              <dd className="font-bold text-ink tabular-nums">Year {student.year}</dd>
            </div>

            <div className="col-span-2">
              <dt className="text-xs font-normal text-ink-2">Email address</dt>
              <dd className="font-bold text-ink truncate">{student.email}</dd>
            </div>

            <div>
              <dt className="text-xs font-normal text-ink-2">Phone</dt>
              <dd className="font-bold text-ink truncate">
                {student.phone || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-normal text-ink-2">Cumulative GPA</dt>
              <dd className="mt-0.5">
                <GpaMeter gpa={student.gpa} />
              </dd>
            </div>

            <div className="col-span-2">
              <dt className="text-xs font-normal text-ink-2">Registration date</dt>
              <dd className="font-normal text-ink-2 text-xs">
                Enrolled {formatDate(student.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Dashed Tear Line above footer actions */}
        <div className="relative py-2 px-4 select-none">
          <div className="border-t-2 border-dashed border-rule-strong" />
          {/* Subtle notch cutouts on sides */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-ground border border-rule-strong" />
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-ground border border-rule-strong" />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-ground/50">
          <Button variant="secondary" onClick={onClose} className="h-10 px-3 text-sm">
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="h-10 px-3 text-sm"
            >
              <Edit2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                onClose();
                onDelete(student);
              }}
              className="h-10 px-3 text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
