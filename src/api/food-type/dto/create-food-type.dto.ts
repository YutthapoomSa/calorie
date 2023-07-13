import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { FoodTypeDB } from './../../../database/entity/food-type.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class CreateFoodTypeReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    foodTypeName: string;
}

class CreateFoodTypeResDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    foodTypeName: string;
}

export class CreateFoodTypeResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => CreateFoodTypeResDTOData,
        description: 'ข้อมูล',
    })
    resData: CreateFoodTypeResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodTypeDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
        const result = new CreateFoodTypeResDTOData();

        if (!!datas) {
            result.id = datas.id;
            result.foodTypeName = datas.foodTypeName;
            this.resData = result;
        }
    }
}
