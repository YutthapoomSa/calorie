import { forwardRef, HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DataBase } from './../../../database/database.providers';
import { FoodDB } from './../../../database/entity/food.entity';
import { UserDB } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
import { BmiService } from './bmi.service';

@Injectable()
export class ApiBmiService implements OnApplicationBootstrap {
    private logger = new LogService(ApiBmiService.name);
    constructor(
        @Inject(DataBase.FoodDB) private foodRepository: typeof FoodDB,
        @Inject('SEQUELIZE') private sequelize: Sequelize,

        @Inject(forwardRef(() => BmiService))
        private bmiService: BmiService,
    ) {}
    onApplicationBootstrap() {
        //
    }

    async api_bmiCalculator(user: UserDB) {
        const tag = this.api_bmiCalculator.name;
        try {
            return await this.bmiService.calculateBmi(user);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async findAll() {
    //     const tag = this.findAll.name;
    //     try {
    //         const findAllBmi = await this.bmiService.findAll();
    //         if (!findAllBmi) return null;
    //         return findAllBmi;
    //     } catch (error) {
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}
