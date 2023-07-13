import { HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GlobalResDTO } from './../../../api/global-dto/global-res.dto';
import { DataBase } from './../../../database/database.providers';
import { ReportDB } from './../../../database/entity/report.entity';
import { LogService } from './../../../helper/services/log.service';
import { ResStatus } from './../../../shared/enum/res-status.enum';
import { FindOneReportResDTO } from '../dto/findone-report.dto';
import { ReportService } from './report.service';

@Injectable()
export class ApiReportService implements OnApplicationBootstrap {
    private logger = new LogService(ApiReportService.name);

    constructor(
        @Inject(DataBase.ReportDB) private readonly reportRepository: typeof ReportDB,
        private reportService: ReportService,
    ) {}
    onApplicationBootstrap() {
        // throw new Error('Method not implemented.');
    }
    // async api_findOne(id: string): Promise<FindOneReportResDTO> {
    //     const tag = this.api_findOne.name;
    //     try {
    //         return new FindOneReportResDTO(ResStatus.success, '', await this.reportService.findOne(id));
    //     } catch (error) {
    //         this.logger.error(`${tag} -> `, error);
    //         throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async api_delete(_reportId: number): Promise<GlobalResDTO> {
        const tag = this.api_delete.name;
        try {
            const result = await this.reportService.setFlexDelete(Number(_reportId));
            return new GlobalResDTO(result ? ResStatus.success : ResStatus.fail, '');
        } catch (error) {
            console.error(`${tag} -> `, error);
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
