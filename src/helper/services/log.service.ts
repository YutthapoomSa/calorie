import moment from 'moment';
import * as winston from 'winston';
export class LogService {
    private tag: string = '';
    private logger = winston.createLogger({
        level: 'debug',
        format: winston.format.simple(),
        // defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: 'log/error.log',
                level: 'error',
            }),
            new winston.transports.File({ filename: 'log/debug.log' }),
        ],
    });

    constructor(private tags: string) {
        this.tag = tags;
    }

    // private setTag(tags: string) {
    //     this.tag = tags;
    // }

    private getDate() {
        return moment().format();
    }

    info(...args: any) {
        this.logger.info(`[${this.getDate()}][${this.tag}] => ${this.toString(args)} `);
    }
    debug(...args: any) {
        this.logger.debug(`[${this.getDate()}][${this.tag}] => ${this.toString(args)} `);
    }
    warn(...args: any) {
        this.logger.warn(`[${this.getDate()}][${this.tag}] => ${this.toString(args)} `);
    }
    error(...args: any) {
        console.log(`[${this.getDate()}][${this.tag}] =>  `, args);
        this.logger.error(`[${this.getDate()}][${this.tag}] =>  ${this.toString(args)} `);
    }
    private toString(args: any) {
        let str = '';
        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                const element = args[key];
                if (typeof element === 'object') {
                    try {
                        str += JSON.stringify(element) + ' ';
                    } catch (error) {
                        console.error(error);
                        console.log(element);
                    }
                } else {
                    str += element + ' ';
                }
            }
        }
        return str;
    }
}
