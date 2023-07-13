import { HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { find } from 'rxjs';
import { ReqBodyCalBMR } from '../dto/body-cal-bmr.dto';
import { DataBase } from './../../../database/database.providers';
import { BmiDB } from './../../../database/entity/bmi.entity';
import { FoodDB } from './../../../database/entity/food.entity';
import { ReportDB } from './../../../database/entity/report.entity';
import { UserDB } from './../../../database/entity/user.entity';
import { LogService } from './../../../helper/services/log.service';
@Injectable()
export class BmiService implements OnApplicationBootstrap {
    private logger = new LogService(BmiService.name);
    constructor(
        @Inject(DataBase.BmiDB)
        private readonly bmiRepository: typeof BmiDB,
        @Inject(DataBase.UserDB)
        private readonly userRepository: typeof UserDB,
        @Inject(DataBase.FoodDB)
        private readonly foodRepository: typeof FoodDB,
        @Inject(DataBase.ReportDB)
        private readonly reportRepository: typeof ReportDB,
    ) {}
    async onApplicationBootstrap() {
        // const findAllUser = await this.userRepository.findAll();
        // for (const item of findAllUser) {
        //     item.targetCal = item.target
        //     await item.save();
        // }
    }
    async calculateBmi(user: UserDB) {
        const tag = this.calculateBmi.name;
        try {
            const findDetailUserById = await this.userRepository.findByPk(user.id);
            if (!findDetailUserById) throw new Error('no data, please verify the correctness of the data.');
            this.logger.debug(`${tag} -> user : `, user);
            console.log('user', user);
            console.log('height', findDetailUserById.height);
            console.log('weight', findDetailUserById.weight);
            console.log('name', findDetailUserById.username);

            const tmpCal = {
                bmi: null,
                stateMent: null,
            };
            const _create = new BmiDB();
            const dataHeight = findDetailUserById.height / 100;
            const cal = Number(findDetailUserById.weight) / Math.pow(Number(dataHeight), 2);
            // this.logger.debug(`${tag} -> cal : `, tmpHeight);
            if (cal < 18.5) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'ผอมเกินไป';
                _create.userId = user.id;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                // return `ดัชนีมวลกาย ${Math.floor(cal)} คุณ ผอมเกินไป`;
                return tmpCal;
            } else if (cal > 18.5 && cal <= 24.9) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'น้ำหนักปกติ';
                _create.userId = user.id;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                return tmpCal;
                // return `ดัชนีมวลกาย ${Math.floor(cal)} คุณ ปกติ`;
            } else if (cal >= 25 && cal <= 29.9) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'น้ำหนักเกิน';
                _create.userId = user.id;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                return tmpCal;
            } else {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'อ้วน';
                _create.userId = user.id;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                return tmpCal;
            }
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // todoสำหรับผู้ชาย : BMR = 66 + (13.7 x น้ำหนักตัวเป็น กก.) + (5 x ส่วนสูงเป็น ซม.) – (6.8 x อายุ)
    // todoสำหรับผู้หญิง : BMR = 665 + (9.6 x น้ำหนักตัวเป็น กก.) + (1.8 x ส่วนสูงเป็น ซม.) – (4.7 x อายุ)
    // todo Bmr*1.2

    async calculateBmr(user: UserDB) {
        const tag = this.calculateBmr.name;
        try {
            if (!user) throw new Error('not Authorized');
            const userDetail = await this.userRepository.findByPk(user.id);
            if (!userDetail) throw new Error('Not Found');
            const gender = userDetail.gender;

            console.log('gender : ', gender);

            // console.log(JSON.stringify(userDetail, null, 2));

            const age = moment().diff(userDetail.birthday, 'years');
            console.log('age : ', age);

            if (gender === 'male') {
                const bmrMale = {
                    gender: '',
                    result: 0,
                };
                bmrMale.gender = gender;
                bmrMale.result = 66.5 + 13.7 * userDetail.weight + 5.003 * userDetail.height - 6.8 * age;
                userDetail.target = bmrMale.result;
                await userDetail.save();
                return bmrMale;
            } else if (gender === 'female') {
                const bmrFemale = {
                    gender: '',
                    result: 0,
                };
                bmrFemale.gender = gender;
                bmrFemale.result = 665 + 9.6 * userDetail.weight + 1.8 * userDetail.height - 4.7 * age;
                userDetail.target = bmrFemale.result;
                await userDetail.save();
                return bmrFemale;
            } else {
                const bmrFail = {
                    gender: '',
                    result: 0,
                    msg: 'not found maybe gender is null try again later',
                };
                return bmrFail;
            }
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async calculateBmrOfFood(user: UserDB, body: ReqBodyCalBMR[]) {
        const tag = this.calculateBmrOfFood.name;
        try {
            if (!user) throw new Error('not Authorized');
            const userDetail = await this.userRepository.findByPk(user.id);
            if (!userDetail) throw new Error('Not Found');
            const findBMI = await this.bmiRepository.findOne({
                where: {
                    userId: user.id,
                },
                order: [['createdAt', 'DESC']],
            });
            // if (!body.foodId) throw new Error('food is required');

            // const food = await this.foodRepository.findByPk(foodId);
            const bmrFood = {
                result: 0,
            };
            let sumCal = 0;
            for (const item of body) {
                const findFood = await this.foodRepository.findByPk(item.foodId);
                if (!findFood) throw new Error('food not found! ');
                sumCal += item.unit * findFood.calorie;

                bmrFood.result = userDetail.targetCal - sumCal;
                const newReport = new ReportDB();
                newReport.userId = user.id;
                newReport.height = userDetail.height;
                newReport.weight = userDetail.weight;
                newReport.bmiTotal = findBMI.bmiTotal;
                newReport.bmrTotal = bmrFood.result;
                newReport.isDelete = false;
                newReport.otherFoodId = null;
                newReport.foodId = item.foodId;
                newReport.unit = item.unit;
                newReport.foodName = findFood.name;
                newReport.calorie = findFood.calorie;
                await newReport.save();
            }

            // bmrFood.result = userDetail.targetCal - sumCal;

            // const findBMI = await this.bmiRepository.findOne({
            //     where: {
            //         userId: user.id,
            //     },
            //     order: [['createdAt', 'DESC']],
            // });
            // const newReport = new ReportDB();
            // newReport.userId = user.id;
            // newReport.height = userDetail.height;
            // newReport.weight = userDetail.weight;
            // newReport.bmiTotal = findBMI.bmiTotal;
            // newReport.bmrTotal = bmrFood.result;
            // newReport.isDelete = false;
            // newReport.otherFoodId = null;
            // await newReport.save();
            // userDetail.target = bmrFood.result;
            // await userDetail.save();
            userDetail.targetCal = bmrFood.result;
            await userDetail.save();
            return bmrFood;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─────────────────────────────────────────────────────────────────────

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async functionClearTargetEveryDay() {
        const tag = this.functionClearTargetEveryDay.name;
        try {
            const findAll = await this.userRepository.findAll();
            for (const item of findAll) {
                item.targetCal = item.target;
                // item.targetCal = 0;
                await item.save();
            }
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
