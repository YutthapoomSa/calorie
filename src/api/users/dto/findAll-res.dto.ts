import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';
import { UserDB, UserDBGender, UserDBRole } from './../../../database/entity/user.entity';
import { ConfigService } from './../../../shared/config/config.service';
import { ResStatus } from './../../../shared/enum/res-status.enum';

class FindAllResDTOResData {
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
    })
    role: UserDBRole;

    @ApiProperty({
        description: 'status เปิด ปิด',
    })
    status: boolean;

    @ApiProperty({
        description: 'เพศ',
    })
    gender: UserDBGender;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    height: number;

    @ApiProperty()
    target: number;

    @ApiProperty()
    birthday: string;
}

export class FindAllResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => [FindAllResDTOResData],
        description: 'ข้อมูล',
    })
    resData: FindAllResDTOResData[];

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB[]) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = [];
        const config = new ConfigService();

        if (!!datas) {
            for (const iterator of datas) {
                const _data = new FindAllResDTOResData();
                _data.id = iterator.id;
                _data.email = iterator.email;
                _data.userName = iterator.username;
                _data.firstName = iterator.firstName;
                _data.lastName = iterator.lastName;
                _data.image = iterator.image ? config.imagePath().userImagePath + '/' + iterator.image : '';
                _data.role = iterator.role;
                _data.status = iterator.status;
                _data.gender = iterator.gender;
                _data.weight = iterator.weight;
                _data.height = iterator.height;
                _data.target = iterator.target;
                _data.birthday = moment(iterator.birthday).format('YYYY-MM-DD HH:mm:ss');
                this.resData.push(_data);
            }
        }
    }
}
