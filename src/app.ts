import express from "express";
import cors from 'cors';
import prisma from "./lib/prisma";
import router from "./routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(router)

export default app;