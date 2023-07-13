import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FindAllReportResDTO } from '../dto/findAll.dto';
import { FindOneReportResDTO } from '../dto/findone-report.dto';
import { DataBase } from './../../../database/database.providers';
import { BmiDB } from './../../../database/entity/bmi.entity';
import { FoodDB } from './../../../database/entity/food.entity';
import { ReportDB } from './../../../database/entity/report.entity';
import { UserDB } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { CacheUsersService } from './../../../api/users/services/cache-users.service';

@Injectable()
export class ReportService {
    private logger = new LogService(ReportService.name);

    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @Inject(DataBase.ReportDB) private readonly reportRepository: typeof ReportDB,
        @Inject(DataBase.UserDB) private readonly userRepository: typeof UserDB,
        @Inject(DataBase.BmiDB) private readonly bmiRepository: typeof BmiDB, // @Inject(forwardRef(() => CacheUsersService)) // private cacheUsersService: CacheUsersService,
    ) {}

    async create(user: UserDB) {
        const tag = this.create.name;
        try {
            const findUser = await this.userRepository.findAll();
            if (!findUser) throw new Error('no user found');
            // console.log('User', JSON.stringify(user, null, 2));
            const bmi = await this.bmiRepository.findAll();
            if (bmi == null) throw new Error('no bmi found');
            // console.log('Bmi', bmi);

            const _create = new ReportDB();

            const findAllReport = await this.findAll(user);
            // console.log(findAllReport);
            // console.log(findAllReport.length);
            if (findAllReport.length === 0) {
                for (const iterator of findUser) {
                    _create.weight = iterator.weight;
                    _create.height = iterator.height;
                    _create.userId = iterator.id;
                    _create.bmrTotal = iterator.target;

                    // console.log(_create);
                    for (const iterator2 of bmi) {
                        // console.log(bmi);
                        // console.log(_create.userId, iterator2.userId);
                        if (_create.userId === iterator2.userId) {
                            // console.log('userId != findAllReport ', iterator2.userId);
                            _create.bmiTotal = iterator2.bmiTotal;
                            await _create.save();
                        }
                    }
                }
            } else {
                for (const iterator of findAllReport) {
                    if (!moment(iterator.createdAt).isSame(moment(Date.now()), 'day')) {
                        for (const iterator2 of findUser) {
                            _create.weight = iterator2.weight;
                            _create.height = iterator2.height;
                            _create.userId = iterator2.id;
                            _create.bmrTotal = iterator2.target;
                            for (const iterator3 of bmi) {
                                // console.log('userId', iterator3.userId);
                                if (_create.userId === iterator3.userId) {
                                    _create.bmiTotal = iterator3.bmiTotal;
                                    await _create.save();
                                }
                            }
                        }
                    }
                }
            }

            return await this.findAll(user);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(user: UserDB) {
        const tag = this.findAll.name;
        try {
            // const findAllFoodInReport = await this.reportRepository.findAll({
            //     attributes: ['createdAt'],
            //     group: ['createdAt'],
            //     order: [['createdAt', 'DESC']],
            // });
            const findAllReport = await this.reportRepository.findAll({
                // include: [
                //     {
                //         model: Food,
                //     },
                // ],
                where: {
                    userId: user.id,
                },
                order: [['createdAt', 'DESC']],
                include: [{ model: FoodDB }],
            });
            if (!findAllReport) throw new Error('no data found');
            // return findAllReport;
            // for (const item of findAllFoodInReport) {
            //     console.log('item-->', item);
            // }
            return findAllReport;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllReport() {
        const tag = this.findAllReport.name;
        try {
            const result = await this.reportRepository.findAll({
                include: [
                    {
                        model: FoodDB,
                        as: 'foodLists',
                    },
                ],
            });

            if (!result) {
                throw new Error('ไม่มีข้อมูลโว้ยยยยย');
            }

            // console.log('result => ', result);

            return new FindAllReportResDTO(ResStatus.success, '', result);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(user: UserDB) {
        const tag = this.findOne.name;
        try {
            console.log('userIdddddd ', JSON.stringify(user, null, 2));
            console.log('userid xxxxxxxx ', user.id);
            const resultReportUser = await this.reportRepository.findOne({
                where: { userId: user.id },
                include: FoodDB,
            });
            if (!resultReportUser) throw new HttpException('User report not found', HttpStatus.NOT_FOUND);

            // user.image = this.convertImageService.getLinkImage(user.image);
            // await this.cacheUsersService.setCacheUser(user);

            return new FindOneReportResDTO(ResStatus.success, '', resultReportUser);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async setFlexDelete(_reportId: number) {
        const tag = this.setFlexDelete.name;
        try {
            const result = await this.reportRepository.update(
                {
                    isDelete: true,
                },
                {
                    where: {
                        id: _reportId,
                    },
                },
            );

            return result[0] > 0;
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // update(id: number, updateReportDto: UpdateReportDto) {
    //   return `This action updates a #${id} report`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} report`;
    // }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    cronDateReport() {
        this.logger.debug(`cron -> EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT`);
        const _moment = moment().toISOString();
        this.reportRepository.destroy({
            where: {
                createdAt: {
                    [Op.lte]: _moment,
                },
            },
        });
    }
}
