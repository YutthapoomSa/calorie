import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ReqBodyCalBMR {
    @ApiProperty({
        description: 'foodId',
    })
    foodId: number;

    @ApiProperty({
        description: 'unit',
    })
    @IsNumber()
    unit: number;
}