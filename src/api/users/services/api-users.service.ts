import { BmiService } from './../../bmi/service/bmi.service';
import {
    CACHE_MANAGER,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Sequelize } from 'sequelize-typescript';
import { GlobalResDTO } from './../../../api/global-dto/global-res.dto';
import { DataBase } from './../../../database/database.providers';
import { UserTokenDB } from '../../../database/entity/user-token.entity';
import { UserDB } from '../../../database/entity/user.entity';
import { ConvertImageService } from '../../../helper/services/convert-image.service';
import { EncryptionService } from '../../../helper/services/encryption.service';
import { LogService } from '../../../helper/services/log.service';
import { PaginationService } from '../../../helper/services/pagination/pagination.service';
import { ConfigService } from '../../../shared/config/config.service';
import { CreateUserReqDTO } from '../dto/create-user-req.dto';
import { FindAllResDTO } from '../dto/findAll-res.dto';
import { UpdateUserReqDTO, UpdateUserResDTO } from '../dto/update-user.dto';
import { UploadUserImageDtoRes } from '../dto/uploadUserImage-dto';
import { UserLoginRefreshToKenReqDto } from '../dto/user-login-refreshToken.dto';
import { UserLoginRequestDTO } from '../dto/user-login.dto';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { FindOneUserResDTO } from './../dto/find-one-user-res.dto';
import { CacheUsersService } from './cache-users.service';
import { UsersService } from './users.service';
import { use } from 'passport';
import { BmiDB } from '../../../database/entity/bmi.entity';

@Injectable()
export class ApiUsersService implements OnApplicationBootstrap {
    private logger = new LogService(ApiUsersService.name);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(DataBase.UserDB) private userRepository: typeof UserDB,
        @Inject(DataBase.UserTokenDB) private userTokenRepository: typeof UserTokenDB,
        @Inject('SEQUELIZE') private sequelize: Sequelize,

        private configService: ConfigService,
        private paginationService: PaginationService,
        private encryptionService: EncryptionService,
        private convertImageService: ConvertImageService,

        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => CacheUsersService))
        private cacheUsersService: CacheUsersService,
        @Inject(forwardRef(() => BmiService))
        private bmiService: BmiService,
    ) {}
    onApplicationBootstrap() {
        //
    }

    async api_findOne(id: string): Promise<FindOneUserResDTO> {
        const tag = this.api_findOne.name;
        try {
            return new FindOneUserResDTO(ResStatus.success, '', await this.usersService.findOne(id));
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_findAll() {
        const tag = this.api_findAll.name;
        try {
            const resultFindAll = await this.usersService.findAll();
            return new FindAllResDTO(ResStatus.success, 'ค้นหาสำเร็จ', resultFindAll);
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_login(userLoginRequestDto: UserLoginRequestDTO) {
        const tag = this.api_login.name;
        try {
            return await this.usersService.login(userLoginRequestDto);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_create(body: CreateUserReqDTO) {
        const tag = this.api_create.name;
        try {
            const email = await this.usersService.isEmail(body.email);

            if (email) {
                return new FindOneUserResDTO(ResStatus.fail, 'อีเมลนี้ถูกใช้ไปแล้ว', null);
            }

            // ─────────────────────────────────────────────────────────────────
            const resultHash = await this.usersService.genPassword(body.password);
            const _salt = resultHash.salt;
            const _hashPass = resultHash.hashPass;

            const user = new UserDB();
            user.email = body.email.trim().toLowerCase();
            user.username = body.username.trim().toLowerCase();
            user.firstName = body.firstName;
            user.lastName = body.lastName;
            user.role = body.role;
            user.password = _hashPass;
            user.gender = body.gender;
            user.weight = body.weight;
            user.height = body.height;
            user.birthday = new Date(body.birthday);
            user.target = 0;
            user.targetCal = user.target;

            // console.log('response ', user.birthday);
            await user.save();
            console.log('UserAfterSave : ', user.id);
            const tmpCal: any = {
                userId: user.id,
                bmi: 0,
                stateMent: null,
            };
            const _create = new BmiDB();
            const dataHeight = user.height / 100;
            const cal = Number(user.weight) / Math.pow(Number(dataHeight), 2);
            // this.logger.debug(`${tag} -> cal : `, tmpHeight);
            if (cal < 18.5) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'ผอมเกินไป';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                // return `ดัชนีมวลกาย ${Math.floor(cal)} คุณ ผอมเกินไป`;
                // return tmpCal;
            } else if (cal > 18.5 && cal <= 24.9) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'น้ำหนักปกติ';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                // return tmpCal;
                // return `ดัชนีมวลกาย ${Math.floor(cal)} คุณ ปกติ`;
            } else if (cal >= 25 && cal <= 29.9) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'น้ำหนักเกิน';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
                // return tmpCal;
            } else {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'อ้วน';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
            }

            const calculateBMR: ResCalBMR = await this.bmiService.calculateBmr(user);
            user.target = calculateBMR.result;
            user.targetCal = 0;
            await user.save();
            return new FindOneUserResDTO(ResStatus.success, 'สร้างสำเร็จ', user);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────
    async api_update(id: string, updateUserDTO: UpdateUserReqDTO) {
        const tag = this.api_create.name;
        try {
            const user = await this.userRepository.findByPk(id);
            console.log('id ', id);

            if (!user) {
                return new UpdateUserResDTO(ResStatus.fail, 'ไม่พบข้อมูลของ user', null);
            }

            if (updateUserDTO.password) {
                // const resultHash = await this.usersService.genPassword(body.password);
                // user.password = resultHash.hashPass;
                user.password = this.encryptionService.encode(updateUserDTO.password);
            }
            const resultHash = await this.usersService.genPassword(updateUserDTO.password);
            const _hashPass = resultHash.hashPass;

            user.username = updateUserDTO.username.trim().toLowerCase();
            user.password = _hashPass;
            user.firstName = updateUserDTO.firstName;
            user.lastName = updateUserDTO.lastName;
            user.weight = updateUserDTO.weight;
            user.height = updateUserDTO.height;
            user.email = updateUserDTO.email.trim().toLowerCase();
            await user.save();
            const tmpCal: any = {
                userId: user.id,
                bmi: 0,
                stateMent: null,
            };
            const _create = new BmiDB();
            const dataHeight = Number(user.height) / 100;
            const cal = Number(user.weight) / Math.pow(Number(dataHeight), 2);
            console.log(dataHeight, cal);
            // this.logger.debug(`${tag} -> cal : `, tmpHeight);
            if (cal < 18.5) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'ผอมเกินไป';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();

                // return `ดัชนีมวลกาย ${Math.floor(cal)} คุณ ผอมเกินไป`;
                // return tmpCal;
            } else if (cal > 18.5 && cal <= 24.9) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'น้ำหนักปกติ';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();

                // return tmpCal;
                // return `ดัชนีมวลกาย ${Math.floor(cal)} คุณ ปกติ`;
            } else if (cal >= 25 && cal <= 29.9) {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'น้ำหนักเกิน';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();

                // return tmpCal;
            } else {
                tmpCal.bmi = cal.toFixed(2);
                tmpCal.stateMent = 'อ้วน';
                _create.userId = tmpCal.userId;
                _create.bmiTotal = tmpCal.bmi;
                await _create.save();
            }
            const calculateBMR: ResCalBMR = await this.bmiService.calculateBmr(user);
            user.target = calculateBMR.result;
            user.targetCal = 0;
            await user.save();

            await this.cacheUsersService.removeCacheUser(user.id);
            return new FindOneUserResDTO(ResStatus.success, '', user);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async api_del(user: UserDB, _id: string): Promise<GlobalResDTO> {
        const tag = this.api_del.name;
        try {
            let res: GlobalResDTO = null;
            await this.usersService
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

    async api_refreshToken(user: UserDB, createUserDto: UserLoginRefreshToKenReqDto) {
        const tag = this.api_refreshToken.name;
        try {
            return await this.usersService.refreshToken(user, createUserDto);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadUserImage(image: Express.Multer.File[], id: string): Promise<UploadUserImageDtoRes> {
        const tag = this.uploadUserImage.name;
        try {
            if (!image || image.length === 0) {
                throw new HttpException(`cannot image user`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const findUser = await this.userRepository.findByPk(id);
            if (!findUser) throw new Error('no user found try again later');
            this.logger.debug('findUser ->  ', findUser);
            findUser.image = image[0].filename ? image[0].filename : null;
            await findUser.save();
            // const afterUpdate = await this.usersService.findOne(id);
            return new UploadUserImageDtoRes(ResStatus.success, '', findUser);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export interface ResCalBMR {
    gender: string;
    result: number;
    msg?: string;
}
