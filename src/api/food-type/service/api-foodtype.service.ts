import { UserDB } from './../../../database/entity/user.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { UpdateFoodTypeDTO, UpdateFoodTypeReqDTO } from './../dto/update-food-type.dto';

import { HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateFoodTypeReqDto, CreateFoodTypeResDTO } from '../dto/create-food-type.dto';
import { ResultFoodResDTO } from '../dto/findAll.dto';
import { UploadFoodTypeImageDtoRes } from '../dto/uploadFoodTypeImage-dto';
import { ApiFoodService } from './../../../api/food/service/api-food.service';
import { GlobalResDTO } from './../../../api/global-dto/global-res.dto';
import { DataBase } from './../../../database/database.providers';
import { FoodTypeDB } from './../../../database/entity/food-type.entity';
import { LogService } from './../../../helper/services/log.service';
import { FoodTypeService } from './food-type.service';

@Injectable()
export class ApiFoodTypeService implements OnApplicationBootstrap {
    private logger = new LogService(ApiFoodService.name);

    constructor(
        @Inject(DataBase.FoodTypeDB) private readonly foodTypeRepository: typeof FoodTypeDB,
        private foodTypeService: FoodTypeService,
    ) { }
    onApplicationBootstrap() {
        //
    }

    async api_create(user: UserDB, createFoodTypeDTO: CreateFoodTypeReqDto): Promise<CreateFoodTypeResDTO> {
        const tag = this.api_create.name;
        try {
            const result = await this.foodTypeService.create(user, createFoodTypeDTO);
            return new CreateFoodTypeResDTO(ResStatus.success, 'สร้างประเภทอาหารสำเร็จ', result);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_update(user: UserDB, id: number, updateFoodTypeDto: UpdateFoodTypeReqDTO): Promise<UpdateFoodTypeDTO> {
        const tag = this.api_update.name;
        try {
            let res: UpdateFoodTypeDTO = null;
            await this.foodTypeService
                .update(id, updateFoodTypeDto)
                .then((response) => {
                    res = new UpdateFoodTypeDTO(ResStatus.success, '😜 อัพเดตประเภทอาหารสำเร็จ 😜', response);
                })
                .catch((error) => {
                    console.error(error);
                    res = new UpdateFoodTypeDTO(ResStatus.fail, 'กรุณาตรวจสอบความถูกต้องของข้อมูล', null);
                });
            return res;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_del(user: UserDB, _id: number): Promise<GlobalResDTO> {
        const tag = this.api_del.name;
        try {
            let res: GlobalResDTO = null;
            await this.foodTypeService
                .remove(_id)
                .then((resp) => {
                    if (resp === 0) {
                        res = new GlobalResDTO(ResStatus.fail, 'ลบไม่สำเร็จ');
                    } else {
                        res = new GlobalResDTO(ResStatus.success, 'ลบสำเร็จ');
                    }
                })
                .catch((err) => {
                    res = new GlobalResDTO(ResStatus.fail, '');
                });

            return res;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_findAll(user: UserDB) {
        const tag = this.api_findAll.name;
        try {
            const foodTypeFindAll = await this.foodTypeService.findAll(user);
            // console.log(JSON.stringify(foodTypeFindAll, null, 2));
            return new ResultFoodResDTO(ResStatus.success, '', foodTypeFindAll);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadFoodTypeImage(image: Express.Multer.File[], id: number): Promise<UploadFoodTypeImageDtoRes> {
        const tag = this.uploadFoodTypeImage.name;
        try {
            if (!image || image.length === 0) {
                throw new HttpException(`cannot image user`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const findFoodType = await this.foodTypeRepository.findByPk(id);
            if (!findFoodType) throw new Error('no user found try again later');
            this.logger.debug('findFoodType ->  ', findFoodType)
            findFoodType.image = image[0].filename ? image[0].filename : null;
            await findFoodType.save();
            // const afterUpdate = await this.usersService.findOne(id);
            return new UploadFoodTypeImageDtoRes(ResStatus.success, '', findFoodType);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
