import multer from 'multer'
import fs from 'fs'
import path from 'path'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = 'uploads/';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});


export const multerConfig = multer({ storage: storage })
