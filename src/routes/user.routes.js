import { Router } from 'express';
import { addUser, deleteUser, listUsers, updateUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/list', listUsers);
router.post('/prueba', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;