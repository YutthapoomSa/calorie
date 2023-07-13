import { HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataBase } from './../../../database/database.providers';
import { LogService } from './../../../helper/services/log.service';
import { FindAllFoodDTO } from '../dto/findAll-food.dto';
import { UpdateFoodReqDTO } from '../dto/update-food.dto';
import { FoodDB } from './../../../database/entity/food.entity';
import { UserDB } from './../../../database/entity/user.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { CreateFoodReqDTO, CreateFoodResDTO } from './../dto/create-food.dto';
import { UpdateFoodResDTO } from './../dto/update-food.dto';
import { FoodService } from './food.service';

@Injectable()
export class ApiFoodService implements OnApplicationBootstrap {
    private logger = new LogService(ApiFoodService.name);

    constructor(
        @Inject(DataBase.FoodDB) private readonly foodRepository: typeof FoodDB,
        private foodService: FoodService,
    ) {}
    onApplicationBootstrap() {
        //
    }

    async api_create(user: UserDB, createFoodDTO: CreateFoodReqDTO): Promise<CreateFoodResDTO> {
        const tag = this.api_create.name;
        try {
            const result = await this.foodService.create(user, createFoodDTO);
            // console.log('result -> ', result);
            return new CreateFoodResDTO(ResStatus.success, '🙄 สร้างเสร็จแล้วนะ 🙄', result);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_update(user: UserDB, id: number, updateFoodReqDto: UpdateFoodReqDTO): Promise<UpdateFoodResDTO> {
        const tag = this.api_update.name;
        try {
            let res: UpdateFoodResDTO = null;
            await this.foodService
                .update(id, updateFoodReqDto)
                .then((response) => {
                    res = new UpdateFoodResDTO(ResStatus.success, '😜 อัพเดตรายการอาหารสำเร็จ 😜', response);
                })
                .catch((error) => {
                    console.error(error);
                    res = new UpdateFoodResDTO(ResStatus.fail, 'กรุณาตรวจสอบความถูกต้องของข้อมูล', null);
                });
            return res;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_findAll() {
        const tag = this.api_findAll.name;
        try {
            const resultFindAll = await this.foodRepository.findAll();
            return new FindAllFoodDTO(ResStatus.success, 'ค้นหาสำเร็จ', resultFindAll);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async api_del(user: UserDB, _id: number): Promise<GlobalResDTO> {
    //     const tag = this.api_del.name;
    //     try {
    //         let res: GlobalResDTO = null;
    //         await this.foodService
    //             .remove(_id)
    //             .then((resp) => {
    //                 if (resp === 0) {
    //                     res = new GlobalResDTO(ResStatus.fail, 'ลบไม่สำเร็จ');
    //                 } else {
    //                     res = new GlobalResDTO(ResStatus.success, 'ลบสำเร็จ');
    //                 }
    //             })
    //             .catch((err) => {
    //                 res = new GlobalResDTO(ResStatus.fail, '');
    //             });

    //         return res;
    //     } catch (error) {
    //         console.error(`${tag} -> `, error);
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}
