import { ApiProperty } from '@nestjs/swagger';
import { ReportDB } from './../../../database/entity/report.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { FoodDetail } from './findAll.dto';

export class FindOneReportResDTOData {
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
    @ApiProperty()
    otherFoodId: any;
    @ApiProperty({
        type: [FoodDetail],
    })
    foodLists: FoodDetail[];
    @ApiProperty()
    readonly createdAt: string;
    @ApiProperty()
    readonly updatedAt: string;
}

export class FindOneReportResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FindOneReportResDTOData,
        description: 'ข้อมูล',
    })
    resData: FindOneReportResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: ReportDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new FindOneReportResDTOData();

        if (!!datas) {
            this.resData.id = datas.id;
            this.resData.height = datas.height;
            this.resData.weight = datas.weight;
            this.resData.bmiTotal = datas.bmiTotal;
            this.resData.bmrTotal = datas.bmrTotal;
            this.resData.userId = datas.userId;
            this.resData.foodLists = [];
            this.resData.otherFoodId = datas.otherFoodId;

            if (!!this.resData.foodLists && this.resData.foodLists) {
                for (const iterator2 of this.resData.foodLists) {
                    const _foodLists = new FoodDetail();
                    _foodLists.id = iterator2.id;
                    _foodLists.name = iterator2.name;
                    _foodLists.calorie = iterator2.calorie;
                    this.resData.foodLists.push(_foodLists);
                }
            }
        }
    }
}
