import { Router } from 'express';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.controller.mjs';
const r = Router();
r.get('/', listTasks);
r.get('/:id', getTask);
r.post('/', createTask);
r.patch('/:id', updateTask);
r.delete('/:id', deleteTask);
export default r;