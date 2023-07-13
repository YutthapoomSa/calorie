/* tslint:disable:no-unused-variable */

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('Service: App', () => {
    // tslint:disable-next-line:prefer-const
    let appService: AppService;

    const mockupAppService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        })
            .overrideProvider(AppService)
            .useValue(appService)
            .compile();

        appService = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(appService).toBeDefined();
    });
});
