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

        res.status(201).json({ message: "Class created successfully", class: newClass });

        if (!newClass) {
            return res.status(500).json({ error: "Error creating class" });
        }
    } catch (error) {
        res.status(500).json({ error: `Error creating class: ${(error as Error).message}` });
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
        res.status(500).json({ error: `Error fetching classes: ${(error as Error).message}` });
    }
}

export async function getClassById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const foundClass = await classModel.getClassById(id);

        if (!foundClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        return res.status(200).json({ class: foundClass });

    } catch (error) {
        return res.status(500).json({ 
            error: `Error fetching class: ${(error as Error).message}` 
        });
    }
}

export async function updateClass(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const updatedClass = await classModel.updateClass(Number(id), data);

        if (!updatedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.status(200).json({ message: "Class updated successfully", class: updatedClass });

    } catch (error) {
        res.status(500).json({ error: `Error updating class: ${(error as Error).message}` });
    }
}


export async function deleteClass(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const deletedClass = await classModel.deleteClass(Number(id));

        if (!deletedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.status(200).json({ message: "Class deleted successfully", class: deletedClass });

    } catch (error) {
        res.status(500).json({ error: `Error deleting class: ${(error as Error).message}` });
    }
}