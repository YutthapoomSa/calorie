import { FoodDB } from './../../../database/entity/food.entity';
/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ApiFoodService } from './../../../api/food/service/api-food.service';
import { DataBase } from './../../../database/database.providers';
import { OtherFoodDB } from './../../../database/entity/other-food.entity';
import { UserDB } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { CreateOtherFoodReqDTO, CreateOtherFoodResDTO } from '../dto/create-other-food.dto';
import { OtherFoodService } from './other-food.service';

@Injectable()
export class ApiOtherFoodService implements OnApplicationBootstrap {
    private logger = new LogService(ApiFoodService.name);
    constructor(
        @Inject(DataBase.OtherFoodDB) private readonly otherFoodRepository: typeof OtherFoodDB,
        private otherFoodService: OtherFoodService,
    ) {}
    onApplicationBootstrap() {
        //
    }

    async api_create(user: UserDB, createOtherFoodDTO: CreateOtherFoodReqDTO): Promise<CreateOtherFoodResDTO> {
        const tag = this.api_create.name;
        try {
            const result = await this.otherFoodService.create(user, createOtherFoodDTO);
            // console.log('result -> ', result);
            return new CreateOtherFoodResDTO(ResStatus.success, '🙄 สร้างเสร็จแล้วนะ 🙄', result);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
