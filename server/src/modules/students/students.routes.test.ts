import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

const app = createApp();

describe("Students API Integration Tests", () => {
  beforeEach(async () => {
    await prisma.student.deleteMany();
  });

  afterAll(async () => {
    await prisma.student.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /api/v1/health", () => {
    it("returns 200 with status ok", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });

  describe("POST /api/v1/students", () => {
    it("returns 201 and creates a student with trimmed and lowercased email", async () => {
      const payload = {
        firstName: "  Marie  ",
        lastName: "  Curie  ",
        email: "  MARIE.CURIE@example.edu  ",
        phone: "+33 12345678",
        course: "Physics",
        year: 3,
        gpa: 3.95,
      };

      const res = await request(app).post("/api/v1/students").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        firstName: "Marie",
        lastName: "Curie",
        email: "marie.curie@example.edu",
        phone: "+33 12345678",
        course: "Physics",
        year: 3,
        gpa: 3.95,
      });
      expect(res.body.data.id).toBeDefined();
    });

    it("returns 400 with field errors when required fields are missing", async () => {
      const res = await request(app).post("/api/v1/students").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.fields).toHaveProperty("firstName");
      expect(res.body.error.fields).toHaveProperty("lastName");
      expect(res.body.error.fields).toHaveProperty("email");
      expect(res.body.error.fields).toHaveProperty("course");
      expect(res.body.error.fields).toHaveProperty("year");
    });

    it("returns 400 when gpa is out of range", async () => {
      const res = await request(app).post("/api/v1/students").send({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.edu",
        course: "Math",
        year: 2,
        gpa: 4.5,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.fields).toHaveProperty("gpa");
    });

    it("returns 409 when email already exists", async () => {
      await prisma.student.create({
        data: {
          firstName: "Existing",
          lastName: "Student",
          email: "existing@example.edu",
          course: "Math",
          year: 2,
        },
      });

      const res = await request(app).post("/api/v1/students").send({
        firstName: "New",
        lastName: "Student",
        email: "existing@example.edu",
        course: "Math",
        year: 1,
      });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("EMAIL_TAKEN");
      expect(res.body.error.fields).toHaveProperty("email");
    });
  });

  describe("GET /api/v1/students", () => {
    beforeEach(async () => {
      await prisma.student.createMany({
        data: [
          {
            firstName: "Ada",
            lastName: "Lovelace",
            email: "ada@example.edu",
            course: "Computer Science",
            year: 4,
            gpa: 3.9,
          },
          {
            firstName: "Alan",
            lastName: "Turing",
            email: "alan@example.edu",
            course: "Mathematics",
            year: 3,
            gpa: 3.8,
          },
          {
            firstName: "Grace",
            lastName: "Hopper",
            email: "grace@example.edu",
            course: "Computer Science",
            year: 2,
            gpa: 3.95,
          },
        ],
      });
    });

    it("returns 200 with paginated student list and metadata", async () => {
      const res = await request(app).get("/api/v1/students?page=1&limit=2");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
      });
    });

    it("filters students by search query q across fields", async () => {
      const res = await request(app).get("/api/v1/students?q=turing");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].lastName).toBe("Turing");
    });

    it("filters students by course", async () => {
      const res = await request(app).get("/api/v1/students?course=Mathematics");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].course).toBe("Mathematics");
    });

    it("sorts students by allowed sort field and order", async () => {
      const res = await request(app).get("/api/v1/students?sort=lastName:asc");

      expect(res.status).toBe(200);
      expect(res.body.data[0].lastName).toBe("Hopper");
      expect(res.body.data[1].lastName).toBe("Lovelace");
      expect(res.body.data[2].lastName).toBe("Turing");
    });

    it("returns 400 when invalid sort parameter is provided", async () => {
      const res = await request(app).get("/api/v1/students?sort=malicious:asc");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/students/courses", () => {
    it("returns 200 with distinct sorted courses list", async () => {
      await prisma.student.createMany({
        data: [
          {
            firstName: "S1",
            lastName: "L1",
            email: "s1@example.edu",
            course: "Physics",
            year: 1,
          },
          {
            firstName: "S2",
            lastName: "L2",
            email: "s2@example.edu",
            course: "Computer Science",
            year: 2,
          },
          {
            firstName: "S3",
            lastName: "L3",
            email: "s3@example.edu",
            course: "Physics",
            year: 3,
          },
        ],
      });

      const res = await request(app).get("/api/v1/students/courses");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(["Computer Science", "Physics"]);
    });
  });

  describe("GET /api/v1/students/:id", () => {
    it("returns 200 with student details", async () => {
      const created = await prisma.student.create({
        data: {
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.edu",
          course: "Math",
          year: 4,
        },
      });

      const res = await request(app).get(`/api/v1/students/${created.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(created.id);
    });

    it("returns 404 when student does not exist", async () => {
      const res = await request(app).get("/api/v1/students/non-existent-id");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("STUDENT_NOT_FOUND");
    });
  });

  describe("PATCH /api/v1/students/:id", () => {
    it("returns 200 and updates student fields", async () => {
      const created = await prisma.student.create({
        data: {
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.edu",
          course: "Math",
          year: 4,
        },
      });

      const res = await request(app)
        .patch(`/api/v1/students/${created.id}`)
        .send({ gpa: 3.98, year: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.gpa).toBe(3.98);
      expect(res.body.data.year).toBe(5);
      expect(res.body.data.firstName).toBe("Ada");
    });

    it("returns 400 when request body is empty", async () => {
      const created = await prisma.student.create({
        data: {
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.edu",
          course: "Math",
          year: 4,
        },
      });

      const res = await request(app).patch(`/api/v1/students/${created.id}`).send({});
      expect(res.status).toBe(400);
    });

    it("returns 404 when student does not exist", async () => {
      const res = await request(app)
        .patch("/api/v1/students/missing-id")
        .send({ firstName: "NewName" });
      expect(res.status).toBe(404);
    });

    it("returns 409 when updating email to an existing student email", async () => {
      const s1 = await prisma.student.create({
        data: {
          firstName: "S1",
          lastName: "L1",
          email: "s1@example.edu",
          course: "Math",
          year: 1,
        },
      });
      const s2 = await prisma.student.create({
        data: {
          firstName: "S2",
          lastName: "L2",
          email: "s2@example.edu",
          course: "Math",
          year: 2,
        },
      });

      const res = await request(app).patch(`/api/v1/students/${s2.id}`).send({ email: s1.email });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("EMAIL_TAKEN");
    });
  });

  describe("DELETE /api/v1/students/:id", () => {
    it("returns 204 and deletes student", async () => {
      const created = await prisma.student.create({
        data: {
          firstName: "To Delete",
          lastName: "Student",
          email: "delete.me@example.edu",
          course: "Math",
          year: 1,
        },
      });

      const res = await request(app).delete(`/api/v1/students/${created.id}`);
      expect(res.status).toBe(204);

      const found = await prisma.student.findUnique({
        where: { id: created.id },
      });
      expect(found).toBeNull();
    });

    it("returns 404 when deleting a non-existent student", async () => {
      const res = await request(app).delete("/api/v1/students/missing-id");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("STUDENT_NOT_FOUND");
    });
  });
});
