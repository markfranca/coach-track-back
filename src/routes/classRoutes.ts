import {Router} from "express";
import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from "../controllers/classControllers";

const router = Router();


router.post("/", createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
//router.put("/:id")
//router.delete("/:id")





export default router