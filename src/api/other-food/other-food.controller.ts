import { FoodDB } from './../../database/entity/food.entity';
import { ApiOtherFoodService } from './service/api-other-food.service';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDB } from './../../database/entity/user.entity';
import { RolesGuard } from './../../helper/guard/role/roles.guard';
import { User } from './../../helper/guard/user.decorator';
import { OtherFoodService } from './service/other-food.service';
import { CreateOtherFoodResDTO, CreateOtherFoodReqDTO } from './dto/create-other-food.dto';

@Controller('other-food')
@ApiTags('other-food')
export class OtherFoodController {
    constructor(
        private readonly otherFoodService: OtherFoodService,
        private readonly apiOtherFoodService: ApiOtherFoodService,
    ) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'สร้างรายการอาหารอื่นๆ' })
    @ApiOkResponse({ type: CreateOtherFoodResDTO })
    create(@User() user: UserDB, @Body() createFoodDto: CreateOtherFoodReqDTO): Promise<CreateOtherFoodResDTO> {
        return this.apiOtherFoodService.api_create(user, createFoodDto);
    }
}
