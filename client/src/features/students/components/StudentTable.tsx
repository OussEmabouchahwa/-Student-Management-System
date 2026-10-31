import { Student } from "../types";
import { StudentRow } from "./StudentRow";

export interface StudentTableProps {
  students: Student[];
  searchQuery?: string;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTable({
  students,
  searchQuery,
  onView,
  onEdit,
  onDelete,
}: StudentTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-rule bg-paper">
      {/* Desktop Table View */}
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-rule bg-surface-hover text-xs font-bold text-ink-2 uppercase tracking-wider">
            <th scope="col" className="py-3 pl-4 pr-3">
              Student
            </th>
            <th scope="col" className="px-3 py-3">
              Course
            </th>
            <th scope="col" className="px-3 py-3">
              Year
            </th>
            <th scope="col" className="px-3 py-3">
              GPA
            </th>
            <th scope="col" className="py-3 pl-3 pr-4 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule bg-paper">
          {students.map((student) => (
            <StudentRow
              key={student.id}
              variant="table"
              student={student}
              searchQuery={searchQuery}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile Stacked List View (<760px) */}
      <ul className="block md:hidden divide-y divide-rule" role="list">
        {students.map((student) => (
          <StudentRow
            key={student.id}
            variant="card"
            student={student}
            searchQuery={searchQuery}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
