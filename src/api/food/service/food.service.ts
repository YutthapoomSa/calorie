import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { CreateFoodReqDTO } from '../dto/create-food.dto';
import { FoodPaginationResDTO } from '../dto/pagination-food.dto';
import { UpdateFoodReqDTO } from '../dto/update-food.dto';
import { DataBase } from './../../../database/database.providers';
import { FoodDB } from './../../../database/entity/food.entity';
import { UserDB, UserDBRole } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
import { PaginationService } from './../../../helper/services/pagination/pagination.service';
import { FoodPaginationDTO } from './../dto/pagination-food.dto';

@Injectable()
export class FoodService {
    private logger = new LogService(FoodService.name);

    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @Inject(DataBase.FoodDB) private readonly foodRepositoryModel: typeof FoodDB,

        private paginationService: PaginationService, // @Inject(DataBase.UserDB) private readonly userRepository: typeof UserDB,
    ) {}

    async create(user: UserDB, createFoodDto: CreateFoodReqDTO) {
        const tag = this.create.name;
        try {
            if (!user) throw new Error('Not Authorized');
            // if (UserDBRole.admin !== user.role) {
            //     throw new Error('Not Role Permission');
            // }

            const _data = new FoodDB();
            _data.name = createFoodDto.name;
            _data.calorie = createFoodDto.calorie;
            _data.foodTypeId = createFoodDto.foodTypeId;
            _data.userId = user.id;
            await _data.save();
            return _data;
        } catch (error) {
            console.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    async update(_id: number, updateFoodReqDto: UpdateFoodReqDTO) {
        const tag = this.update.name;
        try {
            if (!_id) throw new Error('id is required');
            if (!updateFoodReqDto) throw new Error('data is required');

            const resultUpdate = await this.foodRepositoryModel.findOne({
                where: {
                    id: _id,
                },
            });
            if (!resultUpdate)
                throw new Error('no data found with this id maybe is invalid or deleted try again later..');

            resultUpdate.name = updateFoodReqDto.name || resultUpdate.name;
            resultUpdate.calorie = updateFoodReqDto.calorie || resultUpdate.calorie;
            resultUpdate.foodTypeId = updateFoodReqDto.foodTypeId || resultUpdate.foodTypeId;
            await resultUpdate.save();

            const resultUpdateFood = await this.findOne(resultUpdate.id);
            return resultUpdateFood;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────
    async findOne(id: number) {
        const tag = this.findOne.name;
        try {
            const resultFindOne = await this.foodRepositoryModel.findByPk(id);
            if (!resultFindOne) throw new Error('no data found maybe is invalid id or this food has deleted....');
            return resultFindOne;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async findOneFood(_id: number) {
    //     const tag = this.findOneFood.name;
    //     try {
    //         const findFood = await this.foodRepositoryModel.findOne({
    //             where: {
    //                 id: _id,
    //             },
    //         });
    //         return findFood;
    //     } catch (error) {
    //         console.error(`${tag} -> `, error);
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // ─────────────────────────────────────────────────────────────────────
    async findAll() {
        const tag = this.findAll.name;
        try {
            const isFind = await this.foodRepositoryModel.count({});

            if (isFind <= 0) {
                throw new Error('no data try again later...');
            }

            const resultFindAllFood = await this.foodRepositoryModel.findAll();

            return resultFindAllFood;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────
    async foodPagination(paginationDTO: FoodPaginationDTO) {
        const tag = this.foodPagination.name;
        try {
            const resData = {
                totalItems: 0,
                itemsPerPage: 0,
                totalPages: 0,
                currentPage: paginationDTO.page,
            };

            let findOption: FindOptions = {
                order: [['createdAt', 'DESC']],
                // include: [
                //     {
                //         model: AgencySecondaryDB,
                //         attributes: { exclude: ['createdAt', 'updatedAt'] },
                //     },
                // ],
            };
            if (paginationDTO.search) {
                const dataLike = this.paginationService.genSqlLike(['name'], paginationDTO.search);
                if (dataLike) {
                    findOption = Object.assign(findOption, dataLike);
                }
            }
            // จำนวนข้อมูลทั้งหมด ตามเงื่อนไข
            resData.totalItems = await this.foodRepositoryModel.count(findOption);

            // คำนวณชุดข้อมูล
            const padding = this.paginationService.paginationCal(
                resData.totalItems,
                paginationDTO.perPages,
                paginationDTO.page,
            );

            Object.assign(findOption, { order: [['createdAt', 'DESC']] });

            resData.totalPages = padding.totalPages;

            Object.assign(findOption, { offset: padding.skips });
            Object.assign(findOption, { limit: padding.limit });

            const _result = await this.foodRepositoryModel.findAll(findOption);
            const foodIds = [];
            for (const item of _result) {
                foodIds.push(item.id);
            }

            const _result2 = await this.foodRepositoryModel.findAll({
                where: {
                    id: {
                        [Op.in]: foodIds,
                    },
                },
                order: [['createdAt', 'DESC']],
            });
            resData.itemsPerPage = _result2.length;

            return new FoodPaginationResDTO(
                ResStatus.success,
                '',
                _result2,
                resData.totalItems,
                resData.itemsPerPage,
                resData.totalPages,
                resData.currentPage,
            );
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
