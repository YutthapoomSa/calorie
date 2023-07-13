import { ApiReportService } from './service/api-report.service';
import { UserDB } from './../../database/entity/user.entity';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReportService } from './service/report.service';
import { User } from './../../helper/guard/user.decorator';
import { GlobalResDTO } from '../global-dto/global-res.dto';

@Controller('report')
@ApiTags('report')
export class ReportController {
    constructor(private readonly reportService: ReportService, private readonly apiReportService: ApiReportService) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'สร้างรายงาน' })
    async create(@User() user: UserDB) {
        return await this.reportService.create(user);
    }

    @Get('/findAllResult')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'แสดงรายงานทั้งหมด' })
    async findAll(@User() user: UserDB) {
        return await this.reportService.findAll(user);
    }

    @Get('/findAllReport')
    @ApiOperation({ summary: 'แสดงรายงานทั้งหมดของไอ้เหี้ยโด' })
    async findAllReport() {
        return await this.reportService.findAllReport();
    }

    @Get('/findReport')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'GetReportBy_userAuth ของพี่โด' })
    // @ApiOkResponse({ type: FindOneUserResDTO })s
    async findOne(@User() user: UserDB) {
        return await this.reportService.findOne(user);
    }

    @Delete('delete/:reportId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'ลบข้อมูลรีพอร์ต' })
    @ApiParam({ name: 'reportId', type: 'number' })
    @ApiOkResponse({ type: GlobalResDTO })
    async delete(@Param('reportId') reportId: number): Promise<GlobalResDTO> {
        return await this.apiReportService.api_delete(reportId);
    }

    // @Patch(':id')
    // update(@Param('id') id: number, @Body() updateReportDto: UpdateReportDto) {
    //   return this.reportService.update(+id, updateReportDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: number) {
    //   return this.reportService.remove(+id);
    // }
}
