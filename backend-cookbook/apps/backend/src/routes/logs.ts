import { Router } from 'express';
import { logsController } from '../controllers/logsController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', logsController.getLogs);
router.get('/stats', logsController.getStats);
router.post('/simulate', logsController.simulateError);

export default router;
