import { HttpException, HttpStatus } from "@nestjs/common";
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

export const storage = {
    // 1 KB = 1.024 byte
    // 1 MB = 1.048.576 byte
    // 1 GB = 1.073.741.824 byte
    // 1 TB = 1.099.511.627.776 byte.

    limits: {
        fileSize: 5 * 1024 * 1024, // byte => maximum 5MB
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4)$/)) {
            cb(null, true);
        } else {
            cb(
                new HttpException(`Unsupported file type ${path.extname(file.originalname)}`, HttpStatus.BAD_REQUEST),
                false,
            );
        }
    },
    storage: diskStorage({
        destination: `./uploads/the-media`,
        filename: (req, file, cb) => {
            // const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const filename: string = uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        },
    }),
};