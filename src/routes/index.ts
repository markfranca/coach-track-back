import { Router } from "express";



const router = Router();


router.get("/", (req, res) => {
  res.send("Welcome to Coach Track API");
});

export default router;
