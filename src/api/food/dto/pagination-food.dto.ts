import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { FoodDB } from './../../../database/entity/food.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class FoodPaginationDTO {
    @ApiProperty({
        example: '10',
    })
    @IsNotEmpty()
    @IsNumber()
    perPages: number;

    @ApiProperty({
        example: '1',
    })
    @IsNumber()
    @IsNotEmpty()
    page: number;

    @ApiProperty({
        example: '',
    })
    @IsString()
    search: string;
}
export class FoodPaginationData {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    calorie: number;

    @ApiProperty()
    foodTypeId: number;
}

export class FoodPaginationResDTOResData {
    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    itemsPerPage: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    currentPage: number;

    @ApiProperty({
        type: () => [FoodPaginationData],
    })
    datas: FoodPaginationData[];
}

export class FoodPaginationResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FoodPaginationResDTOResData,
        description: 'ข้อมูล',
    })
    resData: FoodPaginationResDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(
        resStatus: ResStatus,
        msg: string,
        datas: FoodDB[],
        totalItems: number,
        itemsPerPage: number,
        totalPages: number,
        currentPage: number,
    ) {
        this.resCode = resStatus;
        this.msg = msg;

        const _resData = new FoodPaginationResDTOResData();
        _resData.itemsPerPage = itemsPerPage;
        _resData.totalItems = totalItems;
        _resData.currentPage = currentPage;
        _resData.totalPages = totalPages;
        _resData.datas = [];

        if (!!datas && datas.length > 0) {
            for (const item of datas) {
                const _data = new FoodPaginationData();
                _data.id = item.id;
                _data.name = item.name;
                _data.calorie = item.calorie;
                _data.foodTypeId = item.foodTypeId;
                _resData.datas.push(_data);
            }
        }
        this.resData = _resData;
    }
}
