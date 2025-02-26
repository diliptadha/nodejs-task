"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SIGNING_KEY = process.env.JWT_SECRET;
if (!JWT_SIGNING_KEY) {
    throw new Error("JWT_SECRET environment variable is not set.");
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
            .status(401)
            .json({ message: "Unauthorized access: Missing or invalid token" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        jsonwebtoken_1.default.verify(token, JWT_SIGNING_KEY);
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Forbidden access: Invalid token" });
    }
};
exports.default = authenticateToken;
