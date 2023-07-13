import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path from 'path';
import { GlobalResDTO } from '../global-dto/global-res.dto';
import { UserDB } from './../../database/entity/user.entity';
import { User } from './../../helper/guard/user.decorator';
import { editFileName, imageFileFilter } from './../../shared/utils/file-upload.utils';
import { CreateFoodTypeReqDto, CreateFoodTypeResDTO } from './dto/create-food-type.dto';
import { CreateFoodTypeImage } from './dto/create-foodType-image.dto';
import { UpdateFoodTypeDTO, UpdateFoodTypeReqDTO } from './dto/update-food-type.dto';
import { ApiFoodTypeService } from './service/api-foodtype.service';
import { FoodTypeService } from './service/food-type.service';

@Controller('food-type')
@ApiTags('food-type')
export class FoodTypeController {
    constructor(
        private readonly foodTypeService: FoodTypeService,
        private readonly apiFoodTypeService: ApiFoodTypeService,
    ) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'สร้างประเภทอาหาร' })
    @ApiOkResponse({ type: CreateFoodTypeResDTO })
    async create(@User() user: UserDB, @Body() createFoodTypeDTO: CreateFoodTypeReqDto): Promise<CreateFoodTypeResDTO> {
        return await this.apiFoodTypeService.api_create(user, createFoodTypeDTO);
    }

    @Patch('update/:foodTypeId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'แก้ไขประเภทอาหาร' })
    @ApiOkResponse({ type: UpdateFoodTypeDTO })
    @ApiParam({ name: 'foodTypeId', type: 'string' })
    async update(
        @Param('foodTypeId') foodTypeId: number,
        @User() user: UserDB,
        @Body() updateFoodTypeDto: UpdateFoodTypeReqDTO,
    ): Promise<UpdateFoodTypeDTO> {
        return await this.apiFoodTypeService.api_update(user, foodTypeId, updateFoodTypeDto);
    }

    @Post('del/:foodTypeId')
    @ApiOperation({ summary: 'ลบประเภทอาหาร' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'foodTypeId', type: 'string' })
    @ApiOkResponse({ type: GlobalResDTO })
    async del(@User() user: UserDB, @Param('foodTypeId') foodTypeId: number): Promise<GlobalResDTO> {
        return await this.apiFoodTypeService.api_del(user, foodTypeId);
    }

    @Get('findAllFoodType')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'findAll foodType' })
    async findAll(@User() user: UserDB) {
        return await this.apiFoodTypeService.api_findAll(user);
    }

    @Post('uploads-image/:foodTypeId')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'เพิ่มรูปภาพ' })
    @UseInterceptors(
        FilesInterceptor('image', 1, {
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
            storage: diskStorage({
                destination: `${path.resolve(__dirname, '..', '..', '..', 'upload', 'image-foodType')}`,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadUserImage(
        @UploadedFiles() image: Express.Multer.File[],
        @Body() body: CreateFoodTypeImage,
        @Param('foodTypeId') foodTypeId: number,
    ) {
        return await this.apiFoodTypeService.uploadFoodTypeImage(image, foodTypeId);
    }
}
