import { ApiProperty } from '@nestjs/swagger';
import { ConfigService } from './../../../shared/config/config.service';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { FoodTypeDB } from '../../../database/entity/food-type.entity';

export class UploadFoodTypeImageDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    foodTypeImagePath: string;
}

export class UploadFoodTypeImageDtoRes {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => UploadFoodTypeImageDto,
        description: 'ข้อมูล',
    })
    resData: UploadFoodTypeImageDto;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, data: FoodTypeDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new UploadFoodTypeImageDto();
        const config = new ConfigService();

        console.log('data', JSON.stringify(data, null, 2));

        if (!!data) {
            this.resData.id = data.id;
            this.resData.foodTypeImagePath = data.image ? config.imagePath().foodTypeImagePath + '/' + data.image : '';
        }
    }
}
