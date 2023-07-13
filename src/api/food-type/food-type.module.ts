import { ApiFoodTypeService } from './service/api-foodtype.service';
import { Module } from '@nestjs/common';
import { FoodTypeService } from './service/food-type.service';
import { FoodTypeController } from './food-type.controller';

@Module({
  controllers: [FoodTypeController],
  providers: [FoodTypeService, ApiFoodTypeService],
  exports: [FoodTypeService]
})
export class FoodTypeModule {}
