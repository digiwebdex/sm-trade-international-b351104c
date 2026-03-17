const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const UPLOAD_BASE = path.join(__dirname, '..', 'uploads');
const BUCKETS = ['cms-images', 'products', 'quote-attachments'];
BUCKETS.forEach(b => {
  const dir = path.join(UPLOAD_BASE, b);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const bucket = req.params.bucket || 'cms-images';
    const subPath = req.query.path ? path.dirname(req.query.path) : '';
    const dir = path.join(UPLOAD_BASE, bucket, subPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext || mime);
  },
});

// POST /api/upload/:bucket — upload file, return public URL
// Query param: ?path=hero-slides/image.jpg (optional subdirectory/name hint)
router.post('/:bucket', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const bucket = req.params.bucket;
  const relativePath = path.relative(UPLOAD_BASE, req.file.path).replace(/\\/g, '/');
  const publicUrl = `${process.env.API_BASE_URL || 'http://localhost:4000'}/uploads/${relativePath}`;

  res.json({ publicUrl, path: relativePath });
});

// POST /api/upload/public/:bucket — public upload (quote attachments)
router.post('/public/:bucket', upload.single('file'), (req, res) => {
  if (req.params.bucket !== 'quote-attachments') {
    return res.status(403).json({ error: 'Public upload only allowed for quote-attachments' });
  }
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const relativePath = path.relative(UPLOAD_BASE, req.file.path).replace(/\\/g, '/');
  res.json({ path: relativePath });
});

module.exports = router;
