import { Router } from "express";
import { studentsController } from "./students.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  createStudentSchema,
  idParamSchema,
  listStudentsQuerySchema,
  updateStudentSchema,
} from "./students.schemas";

export const studentsRouter = Router();

// Courses MUST be registered before /:id so it is not captured as an id parameter
studentsRouter.get("/courses", (req, res, next) => studentsController.courses(req, res, next));

studentsRouter.get("/", validateQuery(listStudentsQuerySchema), (req, res, next) =>
  studentsController.list(req, res, next)
);

studentsRouter.get("/:id", validateParams(idParamSchema), (req, res, next) =>
  studentsController.getById(req, res, next)
);

studentsRouter.post("/", validateBody(createStudentSchema), (req, res, next) =>
  studentsController.create(req, res, next)
);

studentsRouter.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateStudentSchema),
  (req, res, next) => studentsController.update(req, res, next)
);

studentsRouter.delete("/:id", validateParams(idParamSchema), (req, res, next) =>
  studentsController.delete(req, res, next)
);
