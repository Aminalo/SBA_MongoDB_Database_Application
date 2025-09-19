import { Router } from 'express';
import { tasksByStatus, velocityByWeek, topContributors } from '../controllers/reports.controller.mjs';
const r = Router();
r.get('/tasks-by-status', tasksByStatus);
r.get('/velocity', velocityByWeek);
r.get('/top-contributors', topContributors);
export default r;