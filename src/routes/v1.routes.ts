import { Router } from 'express';
import routes from './index';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/', routes);

export default router;
