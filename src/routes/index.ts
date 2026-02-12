import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import studentRoutes from "./studentRoutes";

const router = Router();


router.use("/user", userRoutes );
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);

export default router;