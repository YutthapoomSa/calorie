import { Test, TestingModule } from '@nestjs/testing';
import { GbPrimePayService } from './gb-prime-pay.service';

describe('GbPrimePayService', () => {
    let service: GbPrimePayService;

    const mockupGbPrimePayService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GbPrimePayService],
        })
            .overrideProvider(GbPrimePayService)
            .useValue(mockupGbPrimePayService)
            .compile();

        service = module.get<GbPrimePayService>(GbPrimePayService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
