import { Router } from "express";
import {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getStudentAttendanceSummary
} from "../controllers/attendanceControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verifyIsTeacher } from "../middlewares/rolesMIddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllAttendance);                               
router.get("/:id", getAttendanceById);                               
router.post("/", verifyIsTeacher, createAttendance);                
router.patch("/:id", verifyIsTeacher, updateAttendance);            
router.delete("/:id", verifyIsTeacher, deleteAttendance);           
router.get("/student/:studentId/summary", getStudentAttendanceSummary);

export default router;
