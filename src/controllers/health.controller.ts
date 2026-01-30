import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import prisma from '../config/database';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latency?: number;
      message?: string;
    };
    memory: {
      status: 'ok' | 'warning' | 'critical';
      usage: number;
      total: number;
      heap: number;
      heapTotal: number;
    };
    cpu: {
      status: 'ok' | 'warning' | 'critical';
      usage: number;
    };
  };
}

class HealthController {
  async check(_req: Request, res: Response) {
    const health: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: { status: 'up' },
        memory: {
          status: 'ok',
          usage: process.memoryUsage().heapUsed,
          total: process.memoryUsage().rss,
          heap: process.memoryUsage().heapUsed,
          heapTotal: process.memoryUsage().heapTotal,
        },
        cpu: { status: 'ok', usage: 0 },
      },
    };

    let overallStatus = 'healthy';

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbLatency = Date.now() - dbStart;

      health.checks.database = {
        status: 'up',
        latency: dbLatency,
      };

      if (dbLatency > 1000) {
        health.checks.database.status = 'up';
        health.checks.database.message = `High latency: ${dbLatency}ms`;
        overallStatus = 'degraded';
      }
    } catch (error) {
      health.checks.database = {
        status: 'down',
        message: error instanceof Error ? error.message : 'Unknown database error',
      };
      overallStatus = 'unhealthy';
    }

    const heapUsedMB = health.checks.memory.heap / 1024 / 1024;
    const heapTotalMB = health.checks.memory.heapTotal / 1024 / 1024;
    const rssMB = health.checks.memory.total / 1024 / 1024;

    // Calculate heap usage percentage (used / total heap allocated)
    const heapUsagePercent = heapTotalMB > 0 ? (heapUsedMB / heapTotalMB) * 100 : 0;

    // Update memory data
    health.checks.memory.heap = Math.round(heapUsedMB);
    health.checks.memory.heapTotal = Math.round(heapTotalMB);
    health.checks.memory.total = Math.round(rssMB);

    // Set usage to heap used in MB
    health.checks.memory.usage = Math.round(heapUsedMB);

    // Check if heap usage is critical (>90%) or warning (>75%)
    if (heapUsagePercent > 90) {
      health.checks.memory.status = 'critical';
      overallStatus = 'unhealthy';
    } else if (heapUsagePercent > 75) {
      health.checks.memory.status = 'warning';
      overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus;
    }

    const cpus = require('os').cpus();
    const cpuLoad = require('os').loadavg()[0] / cpus.length;

    health.checks.cpu.usage = Math.round(cpuLoad * 100);

    if (cpuLoad > 0.9) {
      health.checks.cpu.status = 'critical';
      overallStatus = 'unhealthy';
    } else if (cpuLoad > 0.75) {
      health.checks.cpu.status = 'warning';
      overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus;
    }

    health.status = overallStatus as 'healthy' | 'unhealthy' | 'degraded';

    const statusCode = overallStatus === 'unhealthy' ? 503 : 200;

    res.status(statusCode).json(ResponseUtil.success(health, `Service is ${overallStatus}`));
  }

  async readiness(_req: Request, res: Response) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'ready' });
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async liveness(_req: Request, res: Response) {
    res.status(200).json({ status: 'alive', uptime: process.uptime() });
  }
}

export default new HealthController();
