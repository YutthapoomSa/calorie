import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserDB } from './../../../database/entity/user.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class UpdateUserReqDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsOptional()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    weight: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    height: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class UpdateUserResDTOData {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    weight: number;
    @ApiProperty()
    height: number;
    @ApiProperty()
    email: string;
}

export class UpdateUserResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => UpdateUserResDTOData,
        description: 'ข้อมูล',
    })
    resData: UpdateUserResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;

        if (!!datas) {
            const _data = new UpdateUserResDTOData();
            _data.id = datas.id;
            _data.username = datas.username;
            _data.password = datas.password;
            _data.firstName = datas.firstName;
            _data.lastName = datas.lastName;
            _data.weight = datas.weight;
            _data.height = datas.height;
            _data.email = datas.email;

            this.resData = _data;
        }
    }
}
