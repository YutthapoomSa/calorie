import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ReportDB } from './../../../database/entity/report.entity';
import { ResStatus } from './../../../shared/enum/res-status.enum';

export class CreateReportDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    height: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    bmiTotal: number;
}

export class CreateReportResDTOData {
    @ApiProperty()
    weight: string;
    @ApiProperty()
    height: string;
    @ApiProperty()
    bmiTotal: number;
}

// export class CreateReportResDTO {
//     @ApiProperty({
//         enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
//         description: 'รหัสสถานะ',
//     })
//     resCode: ResStatus;

//     @ApiProperty({
//         type: () => CreateReportResDTOData,
//         description: 'ข้อมูล',
//     })
//     resData: CreateReportResDTOData;

//     @ApiProperty({
//         description: 'ข้อความอธิบาย',
//     })
//     msg: string;

//     constructor(resCode: ResStatus, msg: string, datas: ReportDB) {
//         this.resCode = resCode;
//         this.msg = msg;
//         this.resData = null;
//         const result = new CreateReportResDTOData();

//         if (!!datas) {
//             result.height = datas.height;
//         }
//     }
// }
