import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/users.controller.mjs';
const r = Router();
r.get('/', listUsers);
r.get('/:id', getUser);
r.post('/', createUser);
r.patch('/:id', updateUser);
r.delete('/:id', deleteUser);
export default r;