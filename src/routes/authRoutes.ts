import {Router} from "express";
import { getMe, login, register } from "../controllers/authControllers";


const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", getMe)

export default router;