import express, { Application } from 'express';
import { corsMiddleware, helmetMiddleware } from './middleware/security';
import { rateLimiter } from './middleware/rateLimiter';
import { upload, handleUploadError } from './middleware/upload';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestIdMiddleware } from './middleware/requestId';
import v1Routes from './routes/v1.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { config } from './config';

const createApp = (): Application => {
  const app = express();

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);
  app.use(rateLimiter);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(`${config.apiPrefix}`, v1Routes);

  /**
   * @swagger
   * /upload:
   *   post:
   *     summary: Upload a file
   *     tags: [File Upload]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: File uploaded successfully
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
   *                   example: "File uploaded successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     filename:
   *                       type: string
   *                     originalname:
   *                       type: string
   *                     mimetype:
   *                       type: string
   *                     size:
   *                       type: integer
   *       400:
   *         description: No file uploaded or invalid file type
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.post(
    `${config.apiPrefix}/upload`,
    upload.single('file'),
    (req: any, res: any) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    },
    handleUploadError
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
