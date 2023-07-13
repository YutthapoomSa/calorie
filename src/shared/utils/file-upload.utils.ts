import { extname } from 'path';
import { LogService } from './../../helper/services/log.service';

const logger = new LogService('FileUploadUtils');

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/)) {
        logger.error(`Error: File upload only supports images -> ${file.originalname}`);
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
export const editFileName = (req, file, cb) => {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    return cb(null, `${randomName}${extname(file.originalname)}`);
};
