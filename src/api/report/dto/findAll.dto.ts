import { ApiProperty } from '@nestjs/swagger';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { ReportDB } from './../../../database/entity/report.entity';

export class FoodDetail {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    calorie: number;
}

export class FindAllReportResDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    height: number;
    @ApiProperty()
    weight: number;
    @ApiProperty()
    bmiTotal: number;
    @ApiProperty()
    bmrTotal: number;
    @ApiProperty()
    userId: string;
    @ApiProperty({
        type: () => [FoodDetail],
    })
    foodLists: FoodDetail[];
    @ApiProperty()
    otherFoodId: any;
    @ApiProperty()
    readonly createdAt: string;
    @ApiProperty()
    readonly updatedAt: string;
}

export class FindAllReportResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => [FindAllReportResDTOData],
        description: 'ข้อมูล',
    })
    resData: FindAllReportResDTOData[];

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: ReportDB[]) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = [];

        if (!!datas) {
            for (const iterator of datas) {
                const _data = new FindAllReportResDTOData();
                _data.id = iterator.id;
                _data.height = iterator.height;
                _data.weight = iterator.weight;
                _data.bmiTotal = iterator.bmiTotal;
                _data.bmrTotal = iterator.bmrTotal;
                _data.userId = iterator.userId;
                _data.foodLists = [];
                _data.otherFoodId = iterator.otherFoodId;

                if (!!_data.foodLists && _data.foodLists) {
                    for (const iterator2 of _data.foodLists) {
                        const _foodLists = new FoodDetail();
                        _foodLists.id = iterator2.id;
                        _foodLists.name = iterator2.name;
                        _foodLists.calorie = iterator2.calorie;
                        _data.foodLists.push(_foodLists);
                        console.log('_foodLists อยู่ในอีฟ => ', _foodLists);
                    }
                    this.resData.push(_data);
                } else {
                    console.log('elseeee => ');
                }
            }
        }
    }
}
