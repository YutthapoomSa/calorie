import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserNameCheckReqDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly userName: string;
}

export class UserNameCheckResDTO {
    @ApiProperty()
    readonly status: boolean;

    constructor(status: boolean) {
        this.status = status;
    }
}
