import { Router } from 'express';
import { createMainTask, deleteMainTask, getMainTask, getMainTasks, updateMainTask } from '../controllers/mainTask.controller';
import isauthenticated from '../middleware/isAuthenticated';

const router = Router();

router.post('/tasks', isauthenticated, createMainTask);
router.get("/tasks", isauthenticated, getMainTasks);
router.get("/tasks/:taskId", getMainTask);
router.put("/tasks/:taskId", isauthenticated, updateMainTask);
router.delete("/tasks/:taskId", isauthenticated, deleteMainTask);

export default router;
