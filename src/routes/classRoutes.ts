import {Router} from "express";
import { createClass, getAllClasses, getClassById, updateClass, deleteClass, getClassesByTeacherId } from "../controllers/classControllers";
import { verifyIsTeacher } from "../middlewares/rolesMIddleware";

const router = Router();


router.post("/", verifyIsTeacher,createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass)
router.get("/teacher/:teacherId", getClassesByTeacherId);





export default router