import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FoodTypeDB } from './../../../database/entity/food-type.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class UpdateFoodTypeReqDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    foodTypeName: string;
}

export class UpdateFoodTypeResDTOData {
    @ApiProperty()
    foodTypeName: string;
}

export class UpdateFoodTypeDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => UpdateFoodTypeResDTOData,
        description: 'ข้อมูล',
    })
    resData: UpdateFoodTypeResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodTypeDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
        const result = new UpdateFoodTypeResDTOData();

        if (!!datas) {
            result.foodTypeName = datas.foodTypeName;
            this.resData = result;
        }
    }
}
