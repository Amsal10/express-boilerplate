import { Router } from 'express';
import healthController from '../controllers/health.controller';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Comprehensive health check
 *     tags: [Health]
 *     description: Check health status of service including database, memory, and CPU
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, degraded, unhealthy]
 *                     timestamp:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     environment:
 *                       type: string
 *                     version:
 *                       type: string
 *                     checks:
 *                       type: object
 *                       properties:
 *                         database:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             latency:
 *                               type: number
 *                         memory:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             usage:
 *                               type: number
 *                         cpu:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             usage:
 *                               type: number
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', healthController.check);

/**
 * @swagger
 * /health/readiness:
 *   get:
 *     summary: Readiness probe
 *     tags: [Health]
 *     description: Kubernetes readiness probe - checks if service is ready to accept traffic
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ready"
 *       503:
 *         description: Service is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "not ready"
 *                 error:
 *                   type: string
 */
router.get('/readiness', healthController.readiness);

/**
 * @swagger
 * /health/liveness:
 *   get:
 *     summary: Liveness probe
 *     tags: [Health]
 *     description: Kubernetes liveness probe - checks if service is still running
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "alive"
 *                 uptime:
 *                   type: number
 */
router.get('/liveness', healthController.liveness);

export default router;
