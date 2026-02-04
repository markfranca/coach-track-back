import { Router} from "express";
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../controllers/studentControllers";


const router = Router();


router.get("/", getAllStudents);
router.get("/", getStudentById);
router.post("/", createStudent);
router.put("/", updateStudent );
router.delete("/", deleteStudent);

export default router;

