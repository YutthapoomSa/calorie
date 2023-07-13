import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class BmiCalculatorRequestDTO {
    @ApiProperty({
        description: 'น้ำหนัก',
    })
    @IsNumber()
    @IsNotEmpty()
    readonly weight: number;

    @ApiProperty({
        description: 'ส่วนสูง',
    })
    @IsNumber()
    @IsNotEmpty()
    readonly height: number;
}

class BmiCalculatorResData {
    @ApiProperty({
        description: 'น้ำหนัก',
    })
    weight: number;

    @ApiProperty({
        description: 'ส่วนสูง',
    })
    height: number;
}

export class BmiCalculatorResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => BmiCalculatorResData,
        description: 'ข้อมูล',
    })
    resData: BmiCalculatorResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, _weight: number, _height: number) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new BmiCalculatorResData();

        this.resData.weight = null;
        this.resData.height = null;

        if (_weight !== null) {
            this.resData.weight = _weight;
        }
        if (_height !== null) {
            this.resData.height = _height;
        }
    }
}
