import { httpClient } from "../../../lib/http";
import {
  Student,
  StudentFilterParams,
  StudentListResponse,
} from "../types";
import { StudentFormOutput } from "../schemas/student-form.schema";

const BASE_URL = "/api/v1/students";

export async function getStudents(
  params: StudentFilterParams = {}
): Promise<StudentListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.q) searchParams.set("q", params.q);
  if (params.course) searchParams.set("course", params.course);
  if (params.sort) searchParams.set("sort", params.sort);

  const query = searchParams.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  return httpClient<StudentListResponse>(url);
}

export async function getStudentById(id: string): Promise<Student> {
  const response = await httpClient<{ data: Student }>(`${BASE_URL}/${id}`);
  return response.data;
}

export async function getDistinctCourses(): Promise<string[]> {
  const response = await httpClient<{ data: string[] }>(`${BASE_URL}/courses`);
  return response.data;
}

export async function createStudent(data: StudentFormOutput): Promise<Student> {
  const response = await httpClient<{ data: Student }>(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateStudent(
  id: string,
  data: Partial<StudentFormOutput>
): Promise<Student> {
  const response = await httpClient<{ data: Student }>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await httpClient<void>(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
