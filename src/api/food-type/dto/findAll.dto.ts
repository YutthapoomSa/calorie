import { FoodTypeDB } from './../../../database/entity/food-type.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { ConfigService } from './../../../shared/config/config.service';

export class FindAllFoodResDTOData {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    calorie: number;

    @ApiProperty()
    userId: string;
}

export class FindAllFoodTypeResDTOData {
    @ApiProperty()
    id: number;

    @ApiProperty()
    foodTypeName: string;

    @ApiProperty()
    foodTypeImagePath: string;

    @ApiProperty({
        type: [FindAllFoodResDTOData],
    })
    foodLists: FindAllFoodResDTOData[];
}

export class ResultFoodResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => [FindAllFoodTypeResDTOData],
        description: 'ข้อมูล',
    })
    resData: FindAllFoodTypeResDTOData[];

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: FoodTypeDB[]) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = [];
        const config = new ConfigService();

        if (!!datas && datas.length > 0) {
            for (const iterator of datas) {
                const _data = new FindAllFoodTypeResDTOData();
                _data.id = iterator.id;
                _data.foodTypeName = iterator.foodTypeName;
                _data.foodTypeImagePath = iterator.image
                    ? config.imagePath().foodTypeImagePath + '/' + iterator.image
                    : '';
                _data.foodLists = [];

                if (!!iterator.foodLists && iterator.foodLists.length > 0) {
                    for (const iterator2 of iterator.foodLists) {
                        const _food = new FindAllFoodResDTOData();
                        _food.id = iterator2.id;
                        _food.name = iterator2.name;
                        _food.calorie = iterator2.calorie;
                        _food.userId = iterator2.userId;
                        _data.foodLists.push(_food);
                    }
                }
                this.resData.push(_data);
            }
        }
    }
}
