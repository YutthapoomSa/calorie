import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, IsDate, IsDateString } from 'class-validator';
import { UserDBtarget, UserDBGender, UserDBRole } from '../../../database/entity/user.entity';

export class CreateUserReqDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    weight: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    height: number;

    // @ApiProperty()
    // @IsNumber()
    // target: number;

    // @ApiProperty()
    // @IsNumber()
    // targetCal : number;

    @ApiProperty({
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
    })
    @IsEnum(UserDBGender)
    gender: UserDBGender;

    @ApiProperty({
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    })
    @IsEnum(UserDBRole)
    role: UserDBRole;

    @ApiProperty({
        type: Date,
    })
    @IsString()
    @IsNotEmpty()
    birthday: string;
}
