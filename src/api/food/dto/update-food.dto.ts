import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import moment from 'moment';
import { FoodDB } from './../../../database/entity/food.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class UpdateFoodReqDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    calorie: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    foodTypeId: number;
}

export class UpdateFoodResDTOData {
    @ApiProperty({})
    id: number;

    @ApiProperty({})
    name: string;

    @ApiProperty({})
    calorie: number;

    @ApiProperty({})
    foodTypeId: number;

    @ApiProperty({})
    createAt: string;
}

export class UpdateFoodResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => UpdateFoodResDTOData,
        description: 'ข้อมูล',
    })
    resData: UpdateFoodResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
        const result = new UpdateFoodResDTOData();

        if (!!datas) {
            result.id = datas.id;
            result.name = datas.name;
            result.calorie = datas.calorie;
            result.foodTypeId = datas.foodTypeId;
            result.createAt = moment(datas.createdAt).format('YYYY-MM-DD HH:mm:ss');
        }
        this.resData = result;
    }
}
