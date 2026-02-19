import {Router} from "express";
import { createClass, getAllClasses, getClassById, updateClass, deleteClass, getClassesByTeacherId } from "../controllers/classControllers";
import { verifyIsTeacher } from "../middlewares/rolesMIddleware";

const router = Router();


router.post("/", verifyIsTeacher,createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", verifyIsTeacher, updateClass);
router.delete("/:id", verifyIsTeacher,deleteClass)
router.get("/teacher/:teacherId", verifyIsTeacher,getClassesByTeacherId);





export default router