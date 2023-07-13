import { Module } from '@nestjs/common';
import { SharedModule } from './../../shared/shared.module';
import { OtherFoodController } from './other-food.controller';
import { ApiOtherFoodService } from './service/api-other-food.service';
import { OtherFoodService } from './service/other-food.service';

@Module({
    imports: [SharedModule],
    controllers: [OtherFoodController],
    providers: [OtherFoodService, ApiOtherFoodService],
    exports: [OtherFoodService],
})
export class OtherFoodModule {}
