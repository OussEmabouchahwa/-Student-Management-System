import { describe, it, expect, beforeEach } from "vitest";
import { Student } from "@prisma/client";
import { StudentsService } from "./students.service";
import {
  IStudentsRepository,
  StudentFilterParams,
  StudentListResult,
} from "./students.repository";
import { AppError } from "../../lib/app-error";
import { CreateStudentInput, UpdateStudentInput } from "./students.schemas";

class FakeStudentsRepository implements IStudentsRepository {
  public students: Student[] = [];

  async findMany(params: StudentFilterParams): Promise<StudentListResult> {
    let result = [...this.students];

    if (params.course) {
      result = result.filter((s) => s.course === params.course);
    }

    if (params.q) {
      const q = params.q.toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const field = params.sort.field;
      const order = params.sort.order;
      const valA = a[field] ?? "";
      const valB = b[field] ?? "";
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    const total = result.length;
    const skip = (params.page - 1) * params.limit;
    const paginated = result.slice(skip, skip + params.limit);

    return { students: paginated, total };
  }

  async findById(id: string): Promise<Student | null> {
    return this.students.find((s) => s.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.students.find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async create(data: CreateStudentInput): Promise<Student> {
    const created: Student = {
      id: `cuid-${this.students.length + 1}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone ?? null,
      course: data.course,
      year: data.year,
      gpa: data.gpa ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.students.push(created);
    return created;
  }

  async update(id: string, data: UpdateStudentInput): Promise<Student> {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    const current = this.students[index];
    const updated: Student = {
      ...current,
      ...data,
      email: data.email ? data.email.toLowerCase() : current.email,
      phone: data.phone !== undefined ? data.phone : current.phone,
      gpa: data.gpa !== undefined ? data.gpa : current.gpa,
      updatedAt: new Date(),
    };
    this.students[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.students = this.students.filter((s) => s.id !== id);
  }

  async findDistinctCourses(): Promise<string[]> {
    const courses = Array.from(new Set(this.students.map((s) => s.course)));
    courses.sort();
    return courses;
  }
}

describe("StudentsService", () => {
  let fakeRepo: FakeStudentsRepository;
  let service: StudentsService;

  beforeEach(() => {
    fakeRepo = new FakeStudentsRepository();
    service = new StudentsService(fakeRepo);
  });

  it("calculates pagination correctly when records exist", async () => {
    for (let i = 1; i <= 25; i++) {
      fakeRepo.students.push({
        id: `s-${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `student${i}@example.edu`,
        phone: null,
        course: "Engineering",
        year: 2,
        gpa: 3.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const result = await service.listStudents({
      page: 2,
      limit: 10,
      sort: { field: "createdAt", order: "desc" },
    });

    expect(result.data).toHaveLength(10);
    expect(result.meta.page).toBe(2);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.total).toBe(25);
    expect(result.meta.totalPages).toBe(3);
  });

  it("returns zero totalPages when no records match", async () => {
    const result = await service.listStudents({
      page: 1,
      limit: 10,
      sort: { field: "createdAt", order: "desc" },
    });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });

  it("throws EMAIL_TAKEN when creating a student with an existing email", async () => {
    await fakeRepo.create({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.edu",
      course: "Mathematics",
      year: 4,
    });

    await expect(
      service.createStudent({
        firstName: "Ada",
        lastName: "Duplicate",
        email: "ada@example.edu",
        course: "Computer Science",
        year: 1,
      })
    ).rejects.toThrowError(AppError);

    try {
      await service.createStudent({
        firstName: "Ada",
        lastName: "Duplicate",
        email: "ada@example.edu",
        course: "Computer Science",
        year: 1,
      });
    } catch (err) {
      const appErr = err as AppError;
      expect(appErr.code).toBe("EMAIL_TAKEN");
      expect(appErr.statusCode).toBe(409);
    }
  });

  it("throws STUDENT_NOT_FOUND when getting a non-existent student", async () => {
    await expect(service.getStudentById("non-existent")).rejects.toThrowError(AppError);
    try {
      await service.getStudentById("non-existent");
    } catch (err) {
      const appErr = err as AppError;
      expect(appErr.code).toBe("STUDENT_NOT_FOUND");
      expect(appErr.statusCode).toBe(404);
    }
  });

  it("throws STUDENT_NOT_FOUND when updating a non-existent student", async () => {
    await expect(
      service.updateStudent("non-existent", { firstName: "NewName" })
    ).rejects.toThrowError(AppError);
  });

  it("throws EMAIL_TAKEN when updating email to one used by another student", async () => {
    const s1 = await fakeRepo.create({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.edu",
      course: "Math",
      year: 4,
    });
    const s2 = await fakeRepo.create({
      firstName: "Alan",
      lastName: "Turing",
      email: "alan@example.edu",
      course: "Math",
      year: 3,
    });

    await expect(
      service.updateStudent(s2.id, { email: s1.email })
    ).rejects.toThrowError(AppError);
  });

  it("allows updating email to the same email on the same student", async () => {
    const s1 = await fakeRepo.create({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.edu",
      course: "Math",
      year: 4,
    });

    const updated = await service.updateStudent(s1.id, {
      firstName: "Augusta Ada",
      email: "ada@example.edu",
    });

    expect(updated.firstName).toBe("Augusta Ada");
  });

  it("throws STUDENT_NOT_FOUND when deleting a non-existent student", async () => {
    await expect(service.deleteStudent("non-existent")).rejects.toThrowError(AppError);
  });

  it("deletes student successfully", async () => {
    const s1 = await fakeRepo.create({
      firstName: "Grace",
      lastName: "Hopper",
      email: "grace@example.edu",
      course: "Computer Science",
      year: 4,
    });

    await service.deleteStudent(s1.id);
    const inRepo = await fakeRepo.findById(s1.id);
    expect(inRepo).toBeNull();
  });
});
