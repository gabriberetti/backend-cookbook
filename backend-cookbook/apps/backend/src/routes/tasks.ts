import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
