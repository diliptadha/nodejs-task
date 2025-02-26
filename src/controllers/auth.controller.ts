import { Request, Response } from "express";
import Joi from "joi";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma";

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const register = async (req: Request, res: Response) => {
    try {
        const { error, value } = registerSchema.validate(req.body);

        if (error) {
            res.status(400).json({ error: error.details[0].message, success: false });
            return;
        }

        const { name, email, password } = value;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "User already exists", success: false });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ sucess: true, message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ sucess: false, message: "Error registering user", error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { error, value } = loginSchema.validate(req.body);

        if (error) {
            res.status(400).json({ error: error.details[0].message, success: false });
            return;
        }

        const { email, password } = value;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials", success: false });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials", success: false });
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not set.");
        }

        // Create token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "24h",
        });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name }, success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error logging in", error });
    }
};

