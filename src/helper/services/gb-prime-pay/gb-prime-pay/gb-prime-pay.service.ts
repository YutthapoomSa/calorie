import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import { Observable } from 'rxjs';
import { ResGBPayQuery } from '../../interface/gb-query-res.interface';
import { LogService } from '../../log.service';
import { ConfigService } from './../../../../shared/config/config.service';

@Injectable()
export class GbPrimePayService {
    private readonly endPoint = 'https://api.gbprimepay.com';
    private readonly TOKEN =
        'Tfusz4oteMGO29IitdARWtxgYSVhU1UbRS2fIDg6uYavSzwDP9e4NgmV1pcZdfLO8xeOPp7gZYf9cbUomHhN1MjpZyw8BUb9P0vtSJQig4mYRW9lNFc6rwYeEGhmKkM0zsHMnXJlO6aT/68msLU+W/UV6z5FZ1bSl6xBrX4gAf90rw52';
    private logger = new LogService(GbPrimePayService.name);

    constructor(private httpService: HttpService, private configService: ConfigService) {}

    async createTransaction(referenceNo: string, amount: string): Promise<ResGetQrTransaction> {
        const tag = this.createTransaction.name;
        return new Promise(async (resolve, reject) => {
            try {
                const result1 = await this.call_createTransaction(referenceNo, amount);

                // this.call_queryTransaction(referenceNo).subscribe(
                //     resp1 => {
                //         this.logger.debug(`${tag} -> resp1.data : `, resp1.data);

                //         const _data: ResGetQrTransaction = {
                //             qrInfo: result1,
                //             transactionInfo: resp1.data,
                //         };

                //         return resolve(_data);
                //     },
                //     err1 => {
                //         return reject(err1);
                //     },
                // );
            } catch (error) {
                this.logger.error(`${tag} -> `, error);
            }
        });
    }

    // สร้าง QR จ่ายเงิน
    private call_createTransaction(referenceNo: string, amount: string): Promise<ResGetQr> {
        this.logger.debug('referenceNo : ', referenceNo);

        const params = new URLSearchParams();
        params.append('token', this.TOKEN);
        params.append('referenceNo', referenceNo);
        params.append('amount', amount);
        params.append('backgroundUrl', 'https://perfect-lizard-54.loca.lt/cart/callback');

        return new Promise((resolve, reject) => {
            this.httpService
                .post(`${this.endPoint}/gbp/gateway/qrcode`, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    responseType: 'stream',
                })
                .subscribe(
                    async (resp: any) => {
                        this.logger.debug('success');
                        const _path = path.join(__dirname, '../../../../upload-qr');
                        const _fileName = `${new Date().getTime()}.png`;
                        const _fullPath = `${_path}/${_fileName}`;
                        const writer = fs.createWriteStream(_fullPath);

                        resp.data.pipe(writer);

                        writer.on('finish', () => {
                            return resolve({
                                fileName: _fileName,
                                destination: _path,
                                path: _fullPath,
                            });
                        });
                        writer.on('error', reject);
                    },
                    (err) => {
                        this.logger.error(err);
                        return reject(err);
                    },
                );
        });
    }

    // call_queryTransaction(_referenceNo: string): Observable<AxiosResponse<ResGBPayQuery>> {
    //     return this.httpService.post(
    //         `${this.endPoint}/v1/check_status_txn`,
    //         {
    //             referenceNo: _referenceNo,
    //         },
    //         {
    //             headers: {
    //                 Authorization: 'Basic WTJZZnR3VW43bmkzNjhHSDFuME9NUjVldHNDSU1zWDI6',
    //             },
    //         },
    //     );
    // }
}

interface ResGetQr {
    fileName: string;
    destination: string;
    path: string;
}

export interface ResGetQrTransaction {
    qrInfo: ResGetQr;
    transactionInfo: ResGBPayQuery;
}
