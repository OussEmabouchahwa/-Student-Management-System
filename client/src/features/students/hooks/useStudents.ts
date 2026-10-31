import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDistinctCourses, getStudents, getStudentById } from "../api/students.api";
import { studentsKeys } from "../api/students.keys";
import { StudentFilterParams } from "../types";

export function useStudents(params: StudentFilterParams) {
  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: () => getStudents(params),
    placeholderData: keepPreviousData,
  });
}

export function useCourses() {
  return useQuery({
    queryKey: studentsKeys.courses(),
    queryFn: getDistinctCourses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useStudent(id: string | null) {
  return useQuery({
    queryKey: id ? studentsKeys.detail(id) : [],
    queryFn: () => (id ? getStudentById(id) : Promise.reject("No id")),
    enabled: !!id,
  });
}
