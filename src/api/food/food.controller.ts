import { FoodPaginationResDTO, FoodPaginationDTO } from './dto/pagination-food.dto';
import { FoodService } from './service/food.service';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from './../../helper/guard/user.decorator';
import { UserDB } from './../../database/entity/user.entity';
import { CreateFoodReqDTO, CreateFoodResDTO } from './dto/create-food.dto';
import { UpdateFoodReqDTO, UpdateFoodResDTO } from './dto/update-food.dto';
import { ApiFoodService } from './service/api-food.service';

@Controller('food')
@ApiTags('food')
export class FoodController {
    constructor(private readonly apiFoodService: ApiFoodService, private readonly foodService: FoodService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'สร้างอาหาร' })
    @ApiOkResponse({ type: CreateFoodResDTO })
    create(@User() user: UserDB, @Body() createFoodDto: CreateFoodReqDTO): Promise<CreateFoodResDTO> {
        return this.apiFoodService.api_create(user, createFoodDto);
    }

    @Patch('update/:foodId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'แก้ไขรายการอาหาร' })
    @ApiOkResponse({ type: UpdateFoodResDTO })
    @ApiParam({ name: 'foodId', type: 'number' })
    update(
        @Param('foodId') foodId: number,
        @User() user: UserDB,
        @Body() updateFoodDto: UpdateFoodReqDTO,
    ): Promise<UpdateFoodResDTO> {
        return this.apiFoodService.api_update(user, foodId, updateFoodDto);
    }

    @Get('findAllFood')
    @ApiOperation({ summary: 'findAll food หัวควยโด' })
    async findAll() {
        return this.apiFoodService.api_findAll();
    }

    // @Get('findFoodById/:id')
    // @ApiOperation({ summary: 'find food by id' })
    // async findOne(@Param('foodId') id: number): Promise<FindOneFoodResDTO> {
    //     return this.apiFoodService.api_findOne(id);
    // }

    // @Delete('del/:foodId')
    // @ApiOperation({ summary: 'ลบรายการอาหาร' })
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // @ApiParam({ name: 'foodId', type: 'string' })
    // @ApiOkResponse({ type: GlobalResDTO })
    // del(@User() user: UserDB, @Param('foodId') foodId: number): Promise<GlobalResDTO> {
    //     return this.apiFoodService.api_del(user, foodId);
    // }

    @Post('paginationFood')
    @ApiOperation({ summary: 'pagination food' })
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: FoodPaginationResDTO })
    paginationAgency(@Body() paginationDTO: FoodPaginationDTO): Promise<FoodPaginationResDTO> {
        return this.foodService.foodPagination(paginationDTO);
    }
}
