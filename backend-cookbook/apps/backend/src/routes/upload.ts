import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/uploadController';
import { authenticate } from '../middleware/authenticate';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

const router = Router();

router.use(authenticate);

router.post('/', upload.single('file'), uploadController.upload);
router.get('/', uploadController.listFiles);
router.get('/presigned/:key(*)', uploadController.getPresignedUrl);

export default router;
