import {Request, Response} from "express";
import { getAllUsersModel, getUserByIdModel, createUserModel, updateUserModel, deleteUserModel } from "../models/userModels";


export async function getUsers(req: Request, res: Response) {
    try{
        const users =  await getAllUsersModel();
        res.status(200).json(users);

        if (!users) {
            res.status(404).json({ error: "No users found" });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });   
    }
}

export async function getUser(req: Request, res: Response) {
    try{
        const userId = parseInt(req.params.id as string, 10);

        if(!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await getUserByIdModel(userId);

        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }

}

export async function createUser(req: Request, res: Response) {
    try{
        const userData = req.body;

        if(!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ error: "Invalid user data" });
        }
        
        const newUser = await createUserModel(userData);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try{
        const userId = parseInt(req.params.id as string, 10);
        const userData = req.body;

        if(!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        if(!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        const updatedUser = await updateUserModel(userId, userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try{
        const userId = parseInt(req.params.id as string, 10);

        if(!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const deletedUser = await deleteUserModel(userId);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
}