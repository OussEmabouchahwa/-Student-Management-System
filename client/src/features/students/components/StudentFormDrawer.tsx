import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer } from "../../../components/ui/Drawer";
import { Button } from "../../../components/ui/Button";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Student } from "../types";
import {
  studentFormSchema,
  StudentFormValues,
} from "../schemas/student-form.schema";
import { useStudentMutations } from "../hooks/useStudentMutations";
import { useCourses } from "../hooks/useStudents";
import { ApiError } from "../../../lib/http";

export interface StudentFormDrawerProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

const YEAR_OPTIONS = [
  { label: "Year 1", value: 1 },
  { label: "Year 2", value: 2 },
  { label: "Year 3", value: 3 },
  { label: "Year 4", value: 4 },
  { label: "Year 5", value: 5 },
  { label: "Year 6", value: 6 },
];

export function StudentFormDrawer({
  open,
  onClose,
  student,
}: StudentFormDrawerProps) {
  const isEdit = !!student;
  const { createStudent, updateStudent } = useStudentMutations();
  const { data: courses = [] } = useCourses();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      course: "",
      year: 1,
      gpa: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (student) {
        reset({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone || "",
          course: student.course,
          year: student.year,
          gpa: student.gpa !== null ? String(student.gpa) : "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          course: courses[0] || "Computer Science",
          year: 1,
          gpa: "",
        });
      }
    }
  }, [open, student, reset, courses]);

  const onSubmit = async (values: StudentFormValues) => {
    try {
      const parsed = studentFormSchema.parse(values);
      if (isEdit && student) {
        await updateStudent.mutateAsync({
          id: student.id,
          data: parsed,
        });
      } else {
        await createStudent.mutateAsync(parsed);
      }
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        for (const [field, message] of Object.entries(err.fields)) {
          setError(field as keyof StudentFormValues, {
            type: "server",
            message,
          });
        }
      }
    }
  };

  const courseOptions = courses.map((c) => ({ label: c, value: c }));
  if (courseOptions.length === 0) {
    courseOptions.push({ label: "Computer Science", value: "Computer Science" });
  }

  const isPending = createStudent.isPending || updateStudent.isPending || isSubmitting;

  return (
    <Drawer
      open={open}
      onOpenChange={(val) => {
        if (!val && !isPending) onClose();
      }}
      title={isEdit ? "Edit student record" : "Add student record"}
      description={
        isEdit
          ? "Update details for this registered student."
          : "Enter the student details to create a new register record."
      }
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="student-form"
            variant="primary"
            isLoading={isPending}
          >
            {isEdit ? "Save student" : "Add student"}
          </Button>
        </div>
      }
    >
      <form
        id="student-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" error={errors.firstName?.message}>
            {(fieldProps) => (
              <Input
                placeholder="Amira"
                hasError={!!errors.firstName}
                {...register("firstName")}
                {...fieldProps}
              />
            )}
          </Field>

          <Field label="Last name" error={errors.lastName?.message}>
            {(fieldProps) => (
              <Input
                placeholder="Ben Salah"
                hasError={!!errors.lastName}
                {...register("lastName")}
                {...fieldProps}
              />
            )}
          </Field>
        </div>

        <Field label="Email address" error={errors.email?.message}>
          {(fieldProps) => (
            <Input
              type="email"
              placeholder="amira.bensalah@example.edu"
              hasError={!!errors.email}
              {...register("email")}
              {...fieldProps}
            />
          )}
        </Field>

        <Field label="Phone number" optional error={errors.phone?.message}>
          {(fieldProps) => (
            <Input
              type="tel"
              placeholder="+1 555-0101"
              hasError={!!errors.phone}
              {...register("phone")}
              {...fieldProps}
            />
          )}
        </Field>

        <Field label="Course" error={errors.course?.message}>
          {(fieldProps) => (
            <Select
              options={courseOptions}
              hasError={!!errors.course}
              {...register("course")}
              {...fieldProps}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Year of study" error={errors.year?.message}>
            {(fieldProps) => (
              <Select
                options={YEAR_OPTIONS}
                hasError={!!errors.year}
                {...register("year")}
                {...fieldProps}
              />
            )}
          </Field>

          <Field
            label="Cumulative GPA"
            optional
            helperText="Scale 0.00 to 4.00"
            error={errors.gpa?.message}
          >
            {(fieldProps) => (
              <Input
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.85"
                hasError={!!errors.gpa}
                {...register("gpa")}
                {...fieldProps}
              />
            )}
          </Field>
        </div>
      </form>
    </Drawer>
  );
}
