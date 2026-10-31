import { z } from "zod";

export const ALLOWED_SORT_FIELDS = ["lastName", "course", "year", "gpa", "createdAt"] as const;

export type SortField = (typeof ALLOWED_SORT_FIELDS)[number];
export type SortOrder = "asc" | "desc";

export const createStudentSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required." })
    .trim()
    .min(1, "First name is required."),
  lastName: z
    .string({ required_error: "Last name is required." })
    .trim()
    .min(1, "Last name is required."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
  phone: z.string().trim().optional().nullable(),
  course: z.string({ required_error: "Course is required." }).trim().min(1, "Course is required."),
  year: z.coerce
    .number({ required_error: "Year is required." })
    .int("Year must be an integer.")
    .min(1, "Year must be between 1 and 6.")
    .max(6, "Year must be between 1 and 6."),
  gpa: z.coerce
    .number()
    .min(0, "GPA must be between 0.00 and 4.00.")
    .max(4, "GPA must be between 0.00 and 4.00.")
    .optional()
    .nullable(),
});

export const updateStudentSchema = createStudentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update.",
  });

export const idParamSchema = z.object({
  id: z.string().trim().min(1, "Student ID is required."),
});

export const listStudentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  q: z.string().trim().optional(),
  course: z.string().trim().optional(),
  sort: z
    .string()
    .default("createdAt:desc")
    .refine(
      (val) => {
        const [field, order] = val.split(":");
        return (
          ALLOWED_SORT_FIELDS.includes(field as SortField) && (order === "asc" || order === "desc")
        );
      },
      {
        message: "Sort must be one of lastName, course, year, gpa, createdAt with :asc or :desc.",
      }
    )
    .transform((val) => {
      const [field, order] = val.split(":");
      return {
        field: field as SortField,
        order: order as SortOrder,
      };
    }),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
