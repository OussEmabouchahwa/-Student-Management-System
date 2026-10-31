import { StudentFilterParams } from "../types";

export const studentsKeys = {
  all: ["students"] as const,
  lists: () => [...studentsKeys.all, "list"] as const,
  list: (filters: StudentFilterParams) => [...studentsKeys.lists(), filters] as const,
  details: () => [...studentsKeys.all, "detail"] as const,
  detail: (id: string) => [...studentsKeys.details(), id] as const,
  courses: () => [...studentsKeys.all, "courses"] as const,
};
