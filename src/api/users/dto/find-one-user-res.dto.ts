import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';
import { ConfigService } from './../../../shared/config/config.service';
import { UserDB, UserDBGender, UserDBRole } from '../../../database/entity/user.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

class FindOneUserResDTOResData {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty({
        description: 'ข้อมูล',
    })
    userName: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    image: string;

    @ApiProperty({
        description: 'สิทธิ์การเข้าใช้งาน',
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    })
    role: UserDBRole;

    @ApiProperty({
        description: 'status เปิด ปิด',
    })
    status: boolean;

    @ApiProperty({
        description: 'เพศ',
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
    })
    gender: UserDBGender;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    height: number;

    @ApiProperty()
    target: number;

    @ApiProperty()
    targetCal: number;

    @ApiProperty()
    birthday: string;
}

export class FindOneUserResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FindOneUserResDTOResData,
        description: 'ข้อมูล',
    })
    resData: FindOneUserResDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new FindOneUserResDTOResData();
        const config = new ConfigService();

        if (!!datas) {
            this.resData.id = datas.id;
            this.resData.email = datas.email;
            this.resData.userName = datas.username;
            this.resData.firstName = datas.firstName;
            this.resData.lastName = datas.lastName;
            this.resData.image = datas.image ? config.imagePath().userImagePath + '/' + datas.image : '';
            this.resData.role = datas.role;
            this.resData.status = datas.status;
            this.resData.gender = datas.gender;
            this.resData.weight = datas.weight;
            this.resData.height = datas.height;
            this.resData.target = datas.target;
            this.resData.targetCal = datas.targetCal;
            this.resData.birthday = moment(datas.birthday).format('YYYY-MM-DD');
        }
    }
}
