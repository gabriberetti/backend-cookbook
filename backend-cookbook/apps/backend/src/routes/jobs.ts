import { Router } from 'express';
import { jobsController } from '../controllers/jobsController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate);

router.post('/email', jobsController.triggerEmailJob);
router.get('/:id', jobsController.getJobStatus);

export default router;
