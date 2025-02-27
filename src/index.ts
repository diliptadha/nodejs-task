import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import mainTaskRoutes from "./routes/mainTask.route";
import morgan from 'morgan'

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", mainTaskRoutes);


app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// path not found
app.use((req, res) => {
  res.status(404).json({
    message: "404 not found path",
  });
});

// global error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error('Error occurred:', {
    method: req.method,
    path: req.path,
    error: err
  });

  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});


