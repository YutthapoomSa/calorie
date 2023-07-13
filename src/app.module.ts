import { OtherFoodService } from './api/other-food/service/other-food.service';
import { ApiReportService } from './api/report/service/api-report.service';
import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { BmiModule } from './api/bmi/bmi.module';
import { FoodTypeModule } from './api/food-type/food-type.module';
import { ApiFoodTypeService } from './api/food-type/service/api-foodtype.service';
import { FoodModule } from './api/food/food.module';
import { ApiFoodService } from './api/food/service/api-food.service';
import { ReportModule } from './api/report/report.module';
import { UsersModule } from './api/users/users.module';
import { ConvertImageService } from './helper/services/convert-image.service';
import { EncryptionService } from './helper/services/encryption.service';
import { LogService } from './helper/services/log.service';
import { PaginationService } from './helper/services/pagination/pagination.service';
import { SharedModule } from './shared/shared.module';
import { OtherFoodModule } from './api/other-food/other-food.module';
@Module({
    imports: [
        CacheModule.register(),
        UsersModule,
        SharedModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 60,
        }),
        FoodModule,
        FoodTypeModule,
        BmiModule,
        ReportModule,
        OtherFoodModule,
    ],
    providers: [
        ApiFoodService,
        ApiReportService,
        ApiFoodTypeService,
        ApiFoodService,
        LogService,
        ConvertImageService,
        EncryptionService,
        PaginationService,
        OtherFoodService,
    ],
})
export class AppModule {}
