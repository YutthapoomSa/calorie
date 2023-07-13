import { ApiFoodService } from './service/api-food.service';
import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './service/food.service';

@Module({
    controllers: [FoodController],
    providers: [FoodService, ApiFoodService],
    exports: [FoodService]
})
export class FoodModule {}
