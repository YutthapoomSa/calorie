import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataBase } from './../../../database/database.providers';
import { FoodDB } from './../../../database/entity/food.entity';
import { OtherFoodDB } from './../../../database/entity/other-food.entity';
import { UserDB, UserDBRole } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
import { CreateOtherFoodReqDTO } from '../dto/create-other-food.dto';

@Injectable()
export class OtherFoodService {
    private logger = new LogService(OtherFoodService.name);
    constructor(
        @Inject(DataBase.UserDB)
        private readonly userRepository: typeof UserDB,
        @Inject(DataBase.FoodDB)
        private readonly otherFoodRepository: typeof OtherFoodDB,
        @Inject(DataBase.FoodDB)
        private readonly foodRepository: typeof FoodDB,
    ) {}

    async calculateBmrOfFood(user: UserDB, foodId: number) {
        const tag = this.calculateBmrOfFood.name;
        try {
            if (!user) throw new Error('not Authorized');
            const userDetail = await this.userRepository.findByPk(user.id);
            if (!userDetail) throw new Error('Not Found');
            console.log(foodId);
            if (!foodId) throw new Error('food is required');

            const food = await this.otherFoodRepository.findByPk(foodId);

            const bmrOtherFood = {
                resultOtherFood: 0,
            };
            bmrOtherFood.resultOtherFood = userDetail.target - food.otherCalorie;
            userDetail.target = bmrOtherFood.resultOtherFood;
            await userDetail.save();
            return bmrOtherFood;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(user: UserDB, createOtherFoodDto: CreateOtherFoodReqDTO) {
        const tag = this.create.name;
        try {
            if (!user) throw new Error('Not Authorized');
            if (UserDBRole.admin !== user.role) {
                throw new Error('Not Role Permission');
            }

            const _data = new OtherFoodDB();
            _data.otherName = createOtherFoodDto.otherName;
            _data.otherCalorie = createOtherFoodDto.otherCalorie;
            _data.foodTypeId = createOtherFoodDto.foodTypeId;
            await _data.save();
            return _data;
        } catch (error) {
            console.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
