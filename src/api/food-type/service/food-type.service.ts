import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UpdateFoodTypeReqDTO } from '../dto/update-food-type.dto';
import { DataBase } from './../../../database/database.providers';
import { FoodTypeDB } from './../../../database/entity/food-type.entity';
import { FoodDB } from './../../../database/entity/food.entity';
import { OtherFoodDB } from './../../../database/entity/other-food.entity';
import { UserDB, UserDBRole } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
import { CreateFoodTypeReqDto } from './../dto/create-food-type.dto';

@Injectable()
export class FoodTypeService {
    private logger = new LogService(FoodTypeService.name);

    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @Inject(DataBase.FoodTypeDB) private readonly foodTypeRepository: typeof FoodTypeDB, // @Inject(DataBase.UserDB) private readonly userRepository: typeof UserDB,
    ) { }

    async create(user: UserDB, createFoodTypeDTO: CreateFoodTypeReqDto) {
        const tag = this.create.name;
        try {
            if (!user) throw new Error('Not Authorized');
            // console.log('adnajsd; ' , user.role)
            if (user.role !== UserDBRole.admin) throw new Error('Not Authorized');
            if (!createFoodTypeDTO) throw new Error('data is required');

            const _data = new FoodTypeDB();
            console.log('foodtype', createFoodTypeDTO.foodTypeName);
            _data.foodTypeName = createFoodTypeDTO.foodTypeName;
            await _data.save();
            return _data;
        } catch (error) {
            console.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(_id: number, updateFoodTypeDTO: UpdateFoodTypeReqDTO) {
        const tag = this.update.name;
        try {
            if (!_id) throw new Error('id is required');
            if (!updateFoodTypeDTO) throw new Error('data is required');
            const resultUpdate = await this.foodTypeRepository.update(
                {
                    foodTypeName: updateFoodTypeDTO.foodTypeName,
                },
                {
                    where: {
                        id: _id,
                    },
                },
            );
            return await this.findOne(_id);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number) {
        const tag = this.findOne.name;
        try {
            const result = await this.foodTypeRepository.findByPk(id);

            if (!result) {
                throw new Error('not found');
            }
            return result;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(user: UserDB) {
        const tag = this.findAll.name;
        try {
            this.logger.debug('user -> ', user)
            const findAll = await this.foodTypeRepository.findAll({
                include: [
                    {
                        model: FoodDB,
                        where: {
                            [Op.or]: [{
                                userId: null,
                            },
                            {
                                userId: user.id
                            }]
                        }
                    },
                    {
                        model: OtherFoodDB,
                    },
                ],
            });
            if (!findAll) {
                throw new Error('not found try again later ');
            }
            return findAll;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(_id: number) {
        const tag = this.remove.name;
        try {
            return await this.foodTypeRepository.destroy({
                where: {
                    id: _id,
                },
            });
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
