
import multer from 'multer';

// Use memory storage so we can access the buffer directly
const storage = multer.memoryStorage();

// File filter to accept only PDFs (and maybe docs later)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF is allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

export default upload;
