import { Router } from 'express';
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projects.controller.mjs';
const r = Router();
r.get('/', listProjects);
r.get('/:id', getProject);
r.post('/', createProject);
r.patch('/:id', updateProject);
r.delete('/:id', deleteProject);
export default r;