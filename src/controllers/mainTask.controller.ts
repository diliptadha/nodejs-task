import { Request, Response } from "express";
import Joi from 'joi';
import prisma from "../../prisma/prisma";
import { AuthenticatedRequest } from "../middleware/isAuthenticated";

export const createMainTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
});

export const updateMainTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).optional(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
});


export const createMainTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { error, value } = createMainTaskSchema.validate(req.body);
        const { userId } = req.user as { userId: string };

        if (error) {
            res.status(400).json({ success: false, error: error.details[0].message });
            return
        }

        const { title, description, status, dueDate, priority } = value;

        const mainTask = await prisma.mainTask.create({
            data: {
                title,
                description,
                status,
                dueDate,
                priority,
                userId
            }
        });

        res.status(201).json({ success: true, mainTask });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create main task', error });
    }
};


export const getMainTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.user as { userId: string };
        const { limit = 10, page = 1 } = req.query
        const mainTasks = await prisma.mainTask.findMany({
            where: {
                userId: userId
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });
        res.status(200).json({ success: true, mainTasks });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to get main tasks', error });
    }
};

export const getMainTask = async (req: Request, res: Response) => {
    try {
        const mainTask = await prisma.mainTask.findUnique({
            where: {
                id: req.params.taskId
            }
        });
        if (!mainTask) {
            res.status(404).json({ success: false, message: 'Main task not found' });
            return
        }
        res.status(200).json({ success: true, mainTask });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to get main task', error });
    }
};


export const updateMainTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { error, value } = updateMainTaskSchema.validate(req.body);
        if (error) {
            res.status(400).json({ success: false, error: error.details[0].message });
            return
        }
        const { title, description, status, dueDate, priority } = value;

        const mainTask = await prisma.mainTask.update({
            where: {
                id: req.params.taskId
            },
            data: {
                title,
                description,
                status,
                dueDate,
                priority
            }
        });
        res.status(200).json({ success: true, mainTask });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update main task', error });
    }
}

export const deleteMainTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const mainTask = await prisma.mainTask.delete({
            where: {
                id: req.params.taskId
            }
        });
        res.status(200).json({ success: true, mainTask });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete main task', error });
    }
}