import { Logger } from '@nestjs/common';
import { Dialect } from 'sequelize/types';
const logger = new Logger('ORM');
export const config = {
    database: {
        dialect: 'mysql' as Dialect,
        // host: '127.0.0.1',
        // port: 3306,
        // username: 'root',
        // password: '',
        // database: 'db_calorieFood',
        host: '35.240.230.75',
        port: 3306,
        username: 'db_calorieFood',
        password: 'q1q3nS&1',
        database: 'db_calorieFood',
        // logging: false,
        // logging: (msg: any) => logger.log(msg),
        // dialectOptions: {
        //     useUTC: false,
        // },
        timezone: '+07:00', // for writing to database
        // charset: 'utf8mb4',
    },
    jwtPrivateKey: 'jwtPrivateKey',
    loginConfig: {
        encryption: true,
        loginPrivateKey: 'siamIT9999',
    },
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000,
    },
    benchmark: true,
    omiseConfig: {
        secretKey: 'skey_test_5p3j5dqd18pcn3wqhak',
    },
    imagePath: {
        // uploadEndpoint: 'http://192.168.1.57:3100/storage',
        uploadEndpoint: 'http://localhost:3001/storage',
        // uploadEndpoint: "https://phayathaiapi.flowmisite.com/storage",
        // uploadEndpoint: "http://localhost:3000/storage",
    },
};
