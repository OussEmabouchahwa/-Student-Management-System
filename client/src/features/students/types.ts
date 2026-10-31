export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  course: string;
  year: number;
  gpa: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudentListResponse {
  data: Student[];
  meta: StudentPaginationMeta;
}

export interface StudentFilterParams {
  page?: number;
  limit?: number;
  q?: string;
  course?: string;
  sort?: string;
}
