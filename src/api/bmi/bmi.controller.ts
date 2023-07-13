import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDB } from './../../database/entity/user.entity';
import { RolesGuard } from './../../helper/guard/role/roles.guard';
import { User } from './../../helper/guard/user.decorator';
import { ReqBodyCalBMR } from './dto/body-cal-bmr.dto';
import { ApiBmiService } from './service/api-bmi.service';
import { BmiService } from './service/bmi.service';

@Controller('bmi')
@ApiTags('bmi')
export class BmiController {
    constructor(private readonly bmiService: BmiService, private apiBmiService: ApiBmiService) { }

    //     @Get('calculate/:id')
    //     @ApiBearerAuth()
    //     @UseGuards(AuthGuard('jwt'))
    //     @ApiOperation({ summary: 'คำนวณ ' })
    //     async calculateBmi(@User('user') user: UserDB, @Param('userId') id: number) {
    //     return await this.apiBmiService.api_bmiCalculator(user,id);
    // }

    // calculateBmi(@User('user') user: UserDB, @Param('id') id: number) {
    // www.google.com/api/deleteid/1 Paramต้องกำหนดตัวแปร
    // www.google.com/api/getAllUser/5/search?=kfpjsfspg Queryกำนหดตัวแปรก็ได้หรือไม่กำหนดก็ได้

    // ────────────────────────────────────────────────────────────────────────────────
    @Get('cal')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    calculate(@User() user: UserDB) {
        return this.apiBmiService.api_bmiCalculator(user);
    }

    @Get('cal/bmr')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    calculateBmr(@User() user: UserDB) {
        return this.bmiService.calculateBmr(user);
    }

    @Post('cal/:foodId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiBody({
        type: [ReqBodyCalBMR]
    })
    @ApiOperation({ summary: 'bmr-food' })
    async calculateBmrOfFood(@User() user: UserDB, @Body() body: ReqBodyCalBMR[]) {
        return await this.bmiService.calculateBmrOfFood(user, body);
    }
}
