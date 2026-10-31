import { z } from "zod";

export const studentFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  course: z.string().trim().min(1, "Course is required."),
  year: z.coerce
    .number({ invalid_type_error: "Year must be a number." })
    .int("Year must be an integer.")
    .min(1, "Year must be between 1 and 6.")
    .max(6, "Year must be between 1 and 6."),
  gpa: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? null : Math.round(num * 100) / 100;
    })
    .refine(
      (val) => val === null || (val >= 0 && val <= 4.0),
      "GPA must be between 0.00 and 4.00."
    ),
});

export type StudentFormValues = z.input<typeof studentFormSchema>;
export type StudentFormOutput = z.output<typeof studentFormSchema>;
