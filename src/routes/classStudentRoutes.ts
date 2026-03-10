import { Router } from "express";
import { enrollStudent, getClassStudents, removeStudent } from "../controllers/classStudentController";
import { verifyIsTeacher } from "../middlewares/rolesMIddleware";
const router = Router();

router.post("/:id/students", verifyIsTeacher, enrollStudent);
router.delete("/:id/students/:studentId", verifyIsTeacher, removeStudent);
router.get("/:id/students", getClassStudents);