import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import moment from 'moment';
import { OtherFoodDB } from './../../../database/entity/other-food.entity';
import { ResStatus } from './../..//../shared/enum/res-status.enum';

export class CreateOtherFoodReqDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    otherName: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    otherCalorie: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    foodTypeId: number;
}

export class CreateOtherFoodResDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    otherName: string;
    @ApiProperty()
    otherCalorie: number;
    @ApiProperty()
    foodTypeId: number;
    @ApiProperty()
    createdAt: string;
}

export class CreateOtherFoodResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => CreateOtherFoodResDTOData,
        description: 'ข้อมูล',
    })
    resData: CreateOtherFoodResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: OtherFoodDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
        const result = new CreateOtherFoodResDTOData();

        if (!!datas) {
            result.id = datas.id;
            result.otherName = datas.otherName;
            result.otherCalorie = datas.otherCalorie;
            result.foodTypeId = datas.foodTypeId;
            result.createdAt = moment(datas.createdAt).format('YYYY-MM-DD HH:mm:ss');
        }
        this.resData = result;
    }
}
