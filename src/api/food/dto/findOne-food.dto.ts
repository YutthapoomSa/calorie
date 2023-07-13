import { ApiProperty } from '@nestjs/swagger';
import { FoodDB } from './../../../database/entity/food.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class FindOneFoodDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    calorie: number;
    @ApiProperty()
    foodTypeId: number;
}

export class FindOneFoodResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FindOneFoodDTOData,
        description: 'ข้อมูล',
    })
    resData: FindOneFoodDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new FindOneFoodDTOData();

        if (!!datas) {
            this.resData.id = datas.id;
            this.resData.name = datas.name;
            this.resData.calorie = datas.calorie;
            this.resData.foodTypeId = datas.foodTypeId;
        }
    }
}
