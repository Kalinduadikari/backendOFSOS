import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Allow up to 5MB
  },
  fileFilter: fileFilter,
});

export default upload;
