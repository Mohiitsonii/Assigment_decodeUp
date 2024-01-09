import multer, { MulterError } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utilis/errorhandler';
import message from "../message.json"
function ensureTempDirectory() {
  const baseDirectory = path.resolve(__dirname, '..');
  const tempDirectory = path.join(baseDirectory, "uploads");
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory);
  }
}
// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  ensureTempDirectory()
  // Use multer upload instance
  upload.array('images', 5)(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Retrieve uploaded files
    const files = req.files as Express.Multer.File[];
    const errors: string[] = [];
    if (!files || files.length == 0) {
      return next(new ErrorHandler(message.oneImageError, 400));
    }
    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default uploadMiddleware;
