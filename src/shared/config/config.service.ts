import { Injectable } from '@nestjs/common';
import config from '../../../config';

@Injectable()
export class ConfigService {
    get sequelizeOrmConfig() {
        return config.database;
    }

    get jwtConfig() {
        return { privateKey: config.jwtPrivateKey };
    }

    get loginConfig() {
        return { privateKey: config.loginConfig };
    }

    get omiseConfig() {
        return {
            secretKey: config.omiseConfig.secretKey,
        };
    }
    get genPointUpload() {
        return {
            endpoint: config.imagePath.uploadEndpoint,
        };
    }

    get getImagePath() {
        return {
            endPoint: config.imagePath.uploadEndpoint,
        };
    }

    public imagePath() {
        return {
            // userImagePath: 'http://localhost:3001/image-user',
            // foodTypeImagePath: 'http://localhost:3001/image-foodType',
            userImagePath :'https://c7d9-184-22-79-196.ngrok.io/image-user',
            foodTypeImagePath :'https://c7d9-184-22-79-196.ngrok.io/image-foodType'
        };
    }
}
