import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from './../shared/config/config.service';
import { BmiDB } from './entity/bmi.entity';
import { FoodTypeDB } from './entity/food-type.entity';
import { FoodDB } from './entity/food.entity';
import { OtherFoodDB } from './entity/other-food.entity';
import { ReportDB } from './entity/report.entity';
import { UserPasswordDB } from './entity/user-password.entity';
import { UserSocketDB } from './entity/user-socket.entity';
import { UserTokenDB } from './entity/user-token.entity';
import { UserDB } from './entity/user.entity';

export enum DataBase {
    UserDB = 'UserDB',
    UserTokenDB = 'UserTokenDB',
    UserSocketDB = 'UserSocketDB',
    UserPasswordDB = 'UserPasswordDB',
    FoodDB = 'FoodDB',
    FoodTypeDB = 'FoodTypeDB',
    BmiDB = 'BmiDB',
    ReportDB = 'ReportDB',
    OtherFoodDB = 'OtherFoodDB',
}

export const dbProviders = [
    {
        provide: DataBase.UserDB,
        useValue: UserDB,
    },
    {
        provide: DataBase.UserTokenDB,
        useValue: UserTokenDB,
    },
    {
        provide: DataBase.UserPasswordDB,
        useValue: UserPasswordDB,
    },

    {
        provide: DataBase.UserSocketDB,
        useValue: UserSocketDB,
    },

    {
        provide: DataBase.FoodDB,
        useValue: FoodDB,
    },

    {
        provide: DataBase.FoodTypeDB,
        useValue: FoodTypeDB,
    },
    {
        provide: DataBase.BmiDB,
        useValue: BmiDB,
    },
    {
        provide: DataBase.ReportDB,
        useValue: ReportDB,
    },
    {
        provide: DataBase.OtherFoodDB,
        useValue: OtherFoodDB,
    },
];

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize(configService.sequelizeOrmConfig);
            // tslint:disable-next-line:max-line-length
            sequelize.addModels([
                UserDB,
                UserTokenDB,
                UserSocketDB,
                UserPasswordDB,
                FoodDB,
                FoodTypeDB,
                BmiDB,
                ReportDB,
                OtherFoodDB,
            ]);
            // await sequelize.sync({ alter: true });
            // await sequelize.sync({ force: true });
            return sequelize;
        },
        inject: [ConfigService],
    },
];
