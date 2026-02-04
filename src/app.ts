import express from "express";
import cors from 'cors';
import router from "./routes";
import {authMiddleware} from "./middlewares/authMiddleware";




const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware, router)

export default app;