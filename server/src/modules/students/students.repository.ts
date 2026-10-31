import { PrismaClient, Student, Prisma } from "@prisma/client";
import { prisma as defaultPrisma } from "../../lib/prisma";
import { CreateStudentInput, SortField, SortOrder, UpdateStudentInput } from "./students.schemas";

export interface StudentListResult {
  students: Student[];
  total: number;
}

export interface StudentFilterParams {
  page: number;
  limit: number;
  q?: string;
  course?: string;
  sort: {
    field: SortField;
    order: SortOrder;
  };
}

export interface IStudentsRepository {
  findMany(params: StudentFilterParams): Promise<StudentListResult>;
  findById(id: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  create(data: CreateStudentInput): Promise<Student>;
  update(id: string, data: UpdateStudentInput): Promise<Student>;
  delete(id: string): Promise<void>;
  findDistinctCourses(): Promise<string[]>;
}

export class StudentsRepository implements IStudentsRepository {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async findMany(params: StudentFilterParams): Promise<StudentListResult> {
    const { page, limit, q, course, sort } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {};
    const andConditions: Prisma.StudentWhereInput[] = [];

    if (course) {
      andConditions.push({ course: { equals: course } });
    }

    if (q) {
      andConditions.push({
        OR: [
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { email: { contains: q } },
          { course: { contains: q } },
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const orderBy: Prisma.StudentOrderByWithRelationInput = {
      [sort.field]: sort.order,
    };

    const [students, total] = await Promise.all([
      this.db.student.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.db.student.count({ where }),
    ]);

    return { students, total };
  }

  async findById(id: string): Promise<Student | null> {
    return this.db.student.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.db.student.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async create(data: CreateStudentInput): Promise<Student> {
    const formattedGpa =
      data.gpa !== undefined && data.gpa !== null ? Math.round(data.gpa * 100) / 100 : null;

    return this.db.student.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        phone: data.phone ?? null,
        gpa: formattedGpa,
      },
    });
  }

  async update(id: string, data: UpdateStudentInput): Promise<Student> {
    const updatePayload: Prisma.StudentUpdateInput = { ...data };
    if (data.email) {
      updatePayload.email = data.email.toLowerCase();
    }
    if (data.gpa !== undefined) {
      updatePayload.gpa = data.gpa !== null ? Math.round(data.gpa * 100) / 100 : null;
    }
    return this.db.student.update({
      where: { id },
      data: updatePayload,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.student.delete({
      where: { id },
    });
  }

  async findDistinctCourses(): Promise<string[]> {
    const records = await this.db.student.findMany({
      select: { course: true },
      distinct: ["course"],
      orderBy: { course: "asc" },
    });
    return records.map((r) => r.course);
  }
}

export const studentsRepository = new StudentsRepository();
