import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent, updateStudent, deleteStudent } from "../api/students.api";
import { studentsKeys } from "../api/students.keys";
import { StudentFormOutput } from "../schemas/student-form.schema";
import { useToast } from "../../../components/ui/Toast";
import { Student } from "../types";

export function useStudentMutations() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: StudentFormOutput) => createStudent(data),
    onSuccess: (newStudent: Student) => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      showToast(`Added ${newStudent.firstName} ${newStudent.lastName}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StudentFormOutput> }) =>
      updateStudent(id, data),
    onSuccess: (updatedStudent: Student) => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      showToast(`Saved ${updatedStudent.firstName} ${updatedStudent.lastName}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, studentName }: { id: string; studentName: string }) =>
      deleteStudent(id).then(() => studentName),
    onSuccess: (deletedName: string) => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      showToast(`Deleted ${deletedName}`);
    },
  });

  return {
    createStudent: createMutation,
    updateStudent: updateMutation,
    deleteStudent: deleteMutation,
  };
}
