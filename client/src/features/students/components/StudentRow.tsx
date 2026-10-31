import { Edit2, Trash2 } from "lucide-react";
import { Student } from "../types";
import { Avatar } from "../../../components/ui/Avatar";
import { GpaMeter } from "../../../components/ui/GpaMeter";
import { IconButton } from "../../../components/ui/IconButton";
import { StudentHighlight } from "./StudentHighlight";

export interface StudentRowProps {
  student: Student;
  searchQuery?: string;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  variant?: "table" | "card";
}

export function StudentRow({
  student,
  searchQuery,
  onView,
  onEdit,
  onDelete,
  variant = "table",
}: StudentRowProps) {
  const fullName = `${student.firstName} ${student.lastName}`;

  if (variant === "card") {
    return (
      <li className="block md:hidden p-4 border-b border-rule last:border-b-0 hover:bg-surface-hover transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar firstName={student.firstName} lastName={student.lastName} />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onView(student)}
                className="font-serif text-base font-semibold text-ink truncate block text-left hover:text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-sm"
              >
                <StudentHighlight text={fullName} query={searchQuery} />
              </button>
              <p className="truncate text-sm text-ink-2">
                <StudentHighlight text={student.email} query={searchQuery} />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <IconButton aria-label={`Edit ${fullName}`} onClick={() => onEdit(student)}>
              <Edit2 className="h-4 w-4" aria-hidden="true" />
            </IconButton>
            <IconButton
              variant="destructive"
              aria-label={`Delete ${fullName}`}
              onClick={() => onDelete(student)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        <div className="mt-2 text-sm font-medium text-ink">
          <StudentHighlight text={student.course} query={searchQuery} />
        </div>

        <div className="mt-1 flex items-center justify-between text-sm text-ink-2">
          <span className="tabular-nums">Year {student.year}</span>
          <GpaMeter gpa={student.gpa} />
        </div>
      </li>
    );
  }

  return (
    <tr className="hidden md:table-row transition-colors duration-fast hover:bg-surface-hover border-b border-rule last:border-b-0">
      <td className="py-3.5 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <Avatar firstName={student.firstName} lastName={student.lastName} />
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onView(student)}
              className="font-serif text-base font-semibold text-ink text-left hover:text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-sm"
            >
              <StudentHighlight text={fullName} query={searchQuery} />
            </button>
            <div className="truncate text-sm text-ink-2">
              <StudentHighlight text={student.email} query={searchQuery} />
            </div>
          </div>
        </div>
      </td>

      <td className="px-3 py-3.5 text-sm text-ink font-normal">
        <StudentHighlight text={student.course} query={searchQuery} />
      </td>

      <td className="px-3 py-3.5 text-sm text-ink tabular-nums">Year {student.year}</td>

      <td className="px-3 py-3.5">
        <GpaMeter gpa={student.gpa} />
      </td>

      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <IconButton aria-label={`Edit ${fullName}`} onClick={() => onEdit(student)}>
            <Edit2 className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            variant="destructive"
            aria-label={`Delete ${fullName}`}
            onClick={() => onDelete(student)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
}
