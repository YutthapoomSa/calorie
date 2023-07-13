import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path from 'path';
import { GlobalResDTO } from '../global-dto/global-res.dto';
import { UserDB } from './../../database/entity/user.entity';
import { User } from './../../helper/guard/user.decorator';
import { editFileName, imageFileFilter } from './../../shared/utils/file-upload.utils';
import { CreateUserImage } from './dto/create-user-image.dto';
import { CreateUserReqDTO } from './dto/create-user-req.dto';
import { FindOneUserResDTO } from './dto/find-one-user-res.dto';
import { UpdateUserReqDTO } from './dto/update-user.dto';
import { UserLoginRefreshToKenReqDto } from './dto/user-login-refreshToken.dto';
import { UserLoginRequestDTO } from './dto/user-login.dto';
import { ApiUsersService } from './services/api-users.service';
import { UsersService } from './services/users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly apiUsersService: ApiUsersService, private readonly userService: UsersService) { }

    @Post('register')
    @ApiOperation({ summary: 'สมัครสมาชิก' })
    @ApiOkResponse({ type: FindOneUserResDTO })
    register(@Body() body: CreateUserReqDTO) {
        return this.apiUsersService.api_create(body);
    }

    @Post('login')
    @ApiOperation({ summary: 'เข้าสู่ระบบ' })
    login(@Body() body: UserLoginRequestDTO) {
        return this.apiUsersService.api_login(body);
    }

    @Patch('update/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'updateUserBy_id' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiOkResponse({ type: FindOneUserResDTO })
    update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserReqDTO) {
        console.log('check id -> ', id);
        return this.apiUsersService.api_update(id, updateUserDTO);
    }

    @Delete('del/:userId')
    @ApiOperation({ summary: 'ลบบัญชีผู้ใช้' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'userId', type: 'string' })
    @ApiOkResponse({ type: GlobalResDTO })
    del(@User() user: UserDB, @Param('userId') userId: string): Promise<GlobalResDTO> {
        return this.apiUsersService.api_del(user, userId);
    }

    @Get('/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'GetUserBy_id ของพี่โด' })
    @ApiOkResponse({ type: FindOneUserResDTO })
    findOne(@Param('id') id: string): Promise<FindOneUserResDTO> {
        return this.apiUsersService.api_findOne(id);
    }

    @Get('findOneNotCache/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'findOneNotCache' })
    @ApiOkResponse({ type: FindOneUserResDTO })
    findOneNotCache(@Param('id') id: string): Promise<FindOneUserResDTO> {
        return this.userService.findOneNotCache(id);
    }

    @Post('findAllUser')
    @ApiOperation({ summary: 'findAll_User ของพี่โด' })
    async findAll() {
        return this.apiUsersService.api_findAll();
    }

    @Post('refreshToken')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    refreshToken(@User() user: UserDB, @Body() body: UserLoginRefreshToKenReqDto) {
        return this.apiUsersService.api_refreshToken(user, body);
    }

    @Post('uploads-image/:userId')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'เพิ่มรูปภาพ' })
    @UseInterceptors(
        FilesInterceptor('image', 1, {
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
            storage: diskStorage({
                destination: `${path.resolve(__dirname, '..', '..', '..', 'upload', 'userId')}`,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadUserImage(
        @UploadedFiles() image: Express.Multer.File[],
        @Body() body: CreateUserImage,
        @Param('userId') userId: string,
    ) {
        return await this.apiUsersService.uploadUserImage(image, userId);
    }
}
