import { Prisma, Student } from "@prisma/client";
import { AppError } from "../../lib/app-error";
import { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from "./students.schemas";
import { IStudentsRepository, studentsRepository, StudentListResult } from "./students.repository";

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class StudentsService {
  constructor(private readonly repository: IStudentsRepository = studentsRepository) {}

  async listStudents(query: ListStudentsQuery): Promise<PaginatedResult<Student>> {
    const { students, total }: StudentListResult = await this.repository.findMany({
      page: query.page,
      limit: query.limit,
      q: query.q,
      course: query.course,
      sort: query.sort,
    });

    const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

    return {
      data: students,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getCourses(): Promise<string[]> {
    return this.repository.findDistinctCourses();
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.repository.findById(id);
    if (!student) {
      throw AppError.studentNotFound();
    }
    return student;
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const existing = await this.repository.findByEmail(input.email);
    if (existing) {
      throw AppError.emailTaken();
    }

    try {
      return await this.repository.create(input);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw AppError.emailTaken();
      }
      throw error;
    }
  }

  async updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppError.studentNotFound();
    }

    if (input.email && input.email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailConflict = await this.repository.findByEmail(input.email);
      if (emailConflict && emailConflict.id !== id) {
        throw AppError.emailTaken();
      }
    }

    try {
      return await this.repository.update(id, input);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw AppError.emailTaken();
      }
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppError.studentNotFound();
    }

    await this.repository.delete(id);
  }
}

export const studentsService = new StudentsService();
