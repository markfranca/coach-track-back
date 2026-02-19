import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import studentRoutes from "./studentRoutes";
import classRoutes from "./classRoutes";

const router = Router();


router.use("/user", userRoutes );
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classRoutes);
export default router;