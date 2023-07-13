import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import moment from 'moment';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { FoodDB } from './../../../database/entity/food.entity';

export class CreateFoodReqDTO {
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

    @ApiProperty()
    @IsNumber()
    otherCalorie: number;
}

export class CreateFoodResDTOData {
    @ApiProperty({})
    id: number;

    @ApiProperty({})
    name: string;

    @ApiProperty({})
    calorie: number;

    @ApiProperty({})
    foodTypeId: number;

    @ApiProperty({})
    otherCalorie: number;

    @ApiProperty()
    createdAt: string;
}
export class CreateFoodResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => CreateFoodResDTOData,
        description: 'ข้อมูล',
    })
    resData: CreateFoodResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
        const result = new CreateFoodResDTOData();

        if (!!datas) {
            result.id = datas.id;
            result.name = datas.name;
            result.calorie = datas.calorie;
            result.foodTypeId = datas.foodTypeId;
            result.createdAt = moment(datas.createdAt).format('YYYY-MM-DD HH:mm:ss');
        }
        this.resData = result;
    }
}
