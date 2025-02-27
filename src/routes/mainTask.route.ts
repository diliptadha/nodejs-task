import { Router } from 'express';
import { createMainTask, deleteMainTask, getMainTask, getMainTasks, updateMainTask } from '../controllers/mainTask.controller';
import isauthenticated from '../middleware/isAuthenticated';
import { createChildTask, deleteChildTask, getChildTask, updateChildTask } from '../controllers/childTask.controller';

const router = Router();

//main task route
router.post('/tasks', isauthenticated, createMainTask);
router.get("/tasks", isauthenticated, getMainTasks);
router.get("/tasks/:taskId", getMainTask);
router.put("/tasks/:taskId", isauthenticated, updateMainTask);
router.delete("/tasks/:taskId", isauthenticated, deleteMainTask);

//child task route
router.post("/tasks/:mainTaskId/child-tasks", isauthenticated, createChildTask);
router.get("/tasks/:mainTaskId/child-tasks", isauthenticated, getChildTask);
router.delete("/tasks/:mainTaskId/child-tasks/:childTaskId", isauthenticated, deleteChildTask);
router.put("/tasks/:mainTaskId/child-tasks/:childTaskId", isauthenticated, updateChildTask);

export default router;
