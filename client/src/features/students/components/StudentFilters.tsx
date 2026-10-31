import { SearchInput } from "../../../components/ui/SearchInput";
import { Select } from "../../../components/ui/Select";
import { useCourses } from "../hooks/useStudents";
import { StudentFilterParams } from "../types";

export interface StudentFiltersProps {
  filters: StudentFilterParams;
  onChange: (updater: Partial<StudentFilterParams>) => void;
}

const SORT_OPTIONS = [
  { label: "Newest first", value: "createdAt:desc" },
  { label: "Oldest first", value: "createdAt:asc" },
  { label: "Last name (A-Z)", value: "lastName:asc" },
  { label: "Last name (Z-A)", value: "lastName:desc" },
  { label: "Course (A-Z)", value: "course:asc" },
  { label: "Year (1-6)", value: "year:asc" },
  { label: "Highest GPA", value: "gpa:desc" },
  { label: "Lowest GPA", value: "gpa:asc" },
];

export function StudentFilters({ filters, onChange }: StudentFiltersProps) {
  const { data: courses = [] } = useCourses();

  const courseOptions = [
    { label: "All courses", value: "" },
    ...courses.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
      <div className="flex-1">
        <SearchInput
          value={filters.q || ""}
          onChange={(q) => onChange({ q: q || undefined, page: 1 })}
          placeholder="Search by name, email or course..."
        />
      </div>

      <div className="flex flex-row items-center gap-3">
        <div className="w-48 sm:w-56">
          <Select
            aria-label="Filter by course"
            options={courseOptions}
            value={filters.course || ""}
            onChange={(e) => onChange({ course: e.target.value || undefined, page: 1 })}
          />
        </div>

        <div className="w-44 sm:w-48">
          <Select
            aria-label="Sort by"
            options={SORT_OPTIONS}
            value={filters.sort || "createdAt:desc"}
            onChange={(e) => onChange({ sort: e.target.value, page: 1 })}
          />
        </div>
      </div>
    </div>
  );
}
