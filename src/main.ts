import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import fs from 'fs';
import path from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from './helper/pipe/validation.pipe';
import { setupSwagger } from './swagger';
import compression = require('compression');

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const pathUploadPath = path.join(__dirname, './../', 'upload');
    if (!fs.existsSync(pathUploadPath)) fs.mkdirSync(pathUploadPath);

    // ────────────────────────────────────────────────────────────────────────────────

    // const pathDoc = pathUploadPath + '/doc';
    // const pathFile = pathUploadPath + '/file-zip-temp';
    const pathImageUser = pathUploadPath + '/image-user';
    const pathImageFoodType = pathUploadPath + '/image-foodType';
    // if (!fs.existsSync(pathDoc)) fs.mkdirSync(pathDoc);
    // if (!fs.existsSync(pathFile)) fs.mkdirSync(pathFile);
    if (!fs.existsSync(pathImageUser)) fs.mkdirSync(pathImageUser);
    if (!fs.existsSync(pathImageFoodType)) fs.mkdirSync(pathImageFoodType);

    // ────────────────────────────────────────────────────────────────────────────────

    // app.useStaticAssets(path.resolve(__dirname, './../upload', 'doc'), { prefix: '/doc' });
    app.useStaticAssets(path.resolve(__dirname, './../upload', 'image-user'), { prefix: '/image-user' });
    app.useStaticAssets(path.resolve(__dirname, './../upload', 'image-foodType'), { prefix: '/image-foodType' });

    // app.useStaticAssets(join(__dirname, '/upload'), { prefix: '/storage' });
    // app.useStaticAssets(join(__dirname, '/upload-qr'), { prefix: '/qr' });
    app.enableCors({
        origin: '*',
        methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept,Option, Authorization',
        maxAge: 3600,
    });
    app.useGlobalPipes(new ValidationPipe());
    app.use(json({ limit: '300mb' }));
    app.use(compression());
    app.use(urlencoded({ extended: true, limit: '300mb' }));
    app.set('x-powered-by', false);
    setupSwagger(app);
    await app.listen(3001);
}

bootstrap();
