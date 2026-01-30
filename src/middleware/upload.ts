import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler';
import { config } from '../config';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = config.upload.dir;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Invalid file type. Only images and PDF documents are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
  },
});

export const handleUploadError = (error: any, _req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the limit',
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name',
      });
    }
  }
  next(error);
};
