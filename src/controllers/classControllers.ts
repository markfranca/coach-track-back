import { Request, Response } from "express";
import { getTeacherById } from "../models/teacherModels";
import * as classModel from "../models/classModels";

export async function createClass(req: Request, res: Response) {
    try {
        const data = req.body;

        if (!data.name) {
            return res.status(400).json({ error: "Missing required fields: name" });
        }

        if (req.user?.role !== "TEACHER") {
            return res.status(403).json({ error: "You do not have permission to create a class for this teacher" });
        }

        const teacherId = data.teacherId || req.user?.teacherId;
        console.log(teacherId)

        const teacher = await getTeacherById(teacherId);

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        const newClass = await classModel.createClass({...data, teacherId });

        res.status(201).json({ message: "Turma criada com sucesso", class: newClass });

        if (!newClass) {
            return res.status(500).json({ error: "Erro ao criar turma" });
        }
    } catch (error) {
        res.status(500).json({ error: `Erro ao criar turma: ${(error as Error).message}` });
    }
}

export async function getAllClasses(req: Request, res: Response) {
    try {
        const classes = await classModel.getAllClasses();

        if (!classes) {
            return res.status(404).json({ error: "No classes found" });
        }

        res.status(200).json({ classes });

    } catch (error) {
        res.status(500).json({ error: `Erro ao buscar turmas: ${(error as Error).message}` });
    }
}

export async function getClassById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const foundClass = await classModel.getClassById(id);

        if (!foundClass) {
            return res.status(404).json({ error: "Turma não encontrada" });
        }

        return res.status(200).json({ class: foundClass });

    } catch (error) {
        return res.status(500).json({ 
            error: `Erro ao buscar turma: ${(error as Error).message}` 
        });
    }
}

export async function updateClass(req: Request, res: Response) {
    try {
        const { id } = req.params;
        // Lógica para atualizar turma por ID
        res.status(200).json({ message: "Turma atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ error: `Erro ao atualizar turma: ${(error as Error).message}` });
    }
}

export async function deleteClass(req: Request, res: Response) {
    try {
        const { id } = req.params;
        // Lógica para deletar turma por ID
        res.status(200).json({ message: "Turma deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ error: `Erro ao deletar turma: ${(error as Error).message}` });
    }
}