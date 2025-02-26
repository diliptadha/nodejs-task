import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { login, register } from "../controllers/auth.controller";
import Joi from "joi";
import * as bcrypt from "bcrypt";
import prisma from "../../prisma/prisma";

const router = Router();
router.post("/register", register);
// login
router.post("/login", login)

export default router;
