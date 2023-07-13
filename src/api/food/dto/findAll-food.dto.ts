import { ApiProperty } from '@nestjs/swagger';
import { FoodDB } from './../../../database/entity/food.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class FindAllFoodResDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    calorie: number;
    @ApiProperty()
    foodTypeId: number;
}

export class FindAllFoodDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => [FindAllFoodResDTOData],
        description: 'ข้อมูล',
    })
    resData: FindAllFoodResDTOData[];

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodDB[]) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = [];

        if (!!datas) {
            for (const iterator of datas) {
                const _data = new FindAllFoodResDTOData();
                _data.id = iterator.id;
                _data.name = iterator.name;
                _data.calorie = iterator.calorie;
                _data.foodTypeId = iterator.foodTypeId;
                this.resData.push(_data);
            }
        }
    }
}
