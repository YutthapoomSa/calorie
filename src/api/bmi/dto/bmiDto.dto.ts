import { BmiDB } from './../../../database/entity/bmi.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class BmiDTOREQ {
    @ApiProperty({
        description: 'น้ำหนัก',
    })
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @ApiProperty({
        description: 'ส่วนสูง',
    })
    @IsNumber()
    @IsNotEmpty()
    height: number;
}

export class BmiResDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    bmiTotal: number;
}

export class BmiResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => BmiResDTOData,
        description: 'ข้อมูล',
    })
    resData: BmiResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: BmiDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
        const result = new BmiResDTOData();

        if (!!datas) {
            result.id = datas.id;
            result.bmiTotal = datas.bmiTotal;
        }
        this.resData = datas;
    }
}
