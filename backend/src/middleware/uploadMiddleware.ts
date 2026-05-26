import multer from 'multer';
import path from 'path';
import fs from 'fs';

const isServerless = process.env.VERCEL === '1' || !!process.env.VERCEL;

const UPLOAD_DIR = isServerless 
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../../uploads');

// Ensure upload directory exists
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create upload directory, likely read-only env:', error);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Save as matches.csv or deliveries.csv based on fieldname or input name
    const ext = path.extname(file.originalname);
    const baseName = file.fieldname === 'matches' || file.fieldname === 'deliveries' 
      ? file.fieldname 
      : path.basename(file.originalname, ext).toLowerCase();
    
    cb(null, `${baseName}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (fileExt === '.csv' || file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // Limit 100MB
  }
});
export { UPLOAD_DIR };
