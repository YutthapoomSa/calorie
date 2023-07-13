import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodTypeImage {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
    })
    image: any;
}
