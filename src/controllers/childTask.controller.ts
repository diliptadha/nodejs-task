// src/validation/childTaskValidation.ts
import { Request, Response } from 'express';
import Joi from 'joi';
import prisma from '../../prisma/prisma';
import { AuthenticatedRequest } from '../middleware/isAuthenticated';

export const createChildTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
});

export const updateChildTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).optional(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
});

export const createChildTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { error, value } = createChildTaskSchema.validate(req.body);
        const { userId } = req.user as { userId: string };
        const { mainTaskId } = req.params;
        if (error) {
            res.status(400).json({ success: false, error: error.details[0].message });
            return
        }

        const { title, description, status, dueDate, priority } = value;

        const mainTask = await prisma.mainTask.findUnique({
            where: {
                id: mainTaskId
            }
        });

        if (!mainTask) {
            res.status(404).json({ success: false, message: 'Main task not found' });
            return
        }

        if (mainTask.userId !== userId) {
            res.status(403).json({ success: false, message: 'You are not authorized to create a child task for this main task' });
            return
        }

        const childTask = await prisma.childTask.create({
            data: {
                title,
                description,
                status,
                dueDate,
                priority,
                mainTaskId
            }
        });

        res.status(201).json({ success: true, childTask });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

export const getChildTask = async (req: Request, res: Response) => {
    try {
        const childTask = await prisma.childTask.findMany({
            where: {
                mainTaskId: req.params.mainTaskId
            }
        });
        if (!childTask) {
            res.status(404).json({ success: false, message: 'Child task not found' });
            return
        }
        res.status(200).json({ success: true, childTask });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to get child task', error });
    }
};

export const deleteChildTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const mainTask = await prisma.mainTask.findUnique({
            where: {
                id: req.params.mainTaskId
            }
        });

        if (!mainTask) {
            res.status(404).json({ success: false, message: 'Main task not found' });
            return
        }
        await prisma.childTask.delete({
            where: {
                id: req.params.childTaskId
            }
        });
        res.status(200).json({ success: true, message: 'Child task deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete child task', error });
    }
};

export const updateChildTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const mainTask = await prisma.mainTask.findUnique({
            where: {
                id: req.params.mainTaskId
            }
        });

        if (!mainTask) {
            res.status(404).json({ success: false, message: 'Main task not found' });
            return
        }
        const { error, value } = updateChildTaskSchema.validate(req.body);
        if (error) {
            res.status(400).json({ success: false, error: error.details[0].message });
            return
        }
        const { title, description, status, dueDate, priority } = value;
        const childTask = await prisma.childTask.update({
            where: {
                id: req.params.childTaskId
            },
            data: {
                title,
                description,
                status,
                dueDate,
                priority
            }
        });
        res.status(200).json({ success: true, childTask });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update child task', error });
    }
};