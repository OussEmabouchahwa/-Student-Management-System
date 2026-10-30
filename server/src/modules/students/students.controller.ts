import { Request, Response, NextFunction } from "express";
import { studentsService } from "./students.service";
import { ListStudentsQuery } from "./students.schemas";

export class StudentsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as ListStudentsQuery;
      const result = await studentsService.listStudents(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async courses(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courses = await studentsService.getCourses();
      res.status(200).json({ data: courses });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await studentsService.getStudentById(req.params.id);
      res.status(200).json({ data: student });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await studentsService.createStudent(req.body);
      res.status(201).json({ data: student });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await studentsService.updateStudent(req.params.id, req.body);
      res.status(200).json({ data: student });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await studentsService.deleteStudent(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const studentsController = new StudentsController();
