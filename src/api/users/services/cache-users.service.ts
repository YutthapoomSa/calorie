import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LogService } from '../../../helper/services/log.service';
import { UserDB } from './../../../database/entity/user.entity';

@Injectable()
export class CacheUsersService implements OnApplicationBootstrap {
    private logger = new LogService(CacheUsersService.name);

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}
    onApplicationBootstrap() {
        this.removeAll();
    }

    // [set cache]────────────────────────────────────────────────────────────────────────────────
    async setCacheUser(user: UserDB) {
        const tag = this.setCacheUser.name;
        try {
           const result =  await this.cacheManager.set(`user${user.id}`, user.toJSON(), {
                ttl: 60 * 5,
            });
            this.logger.debug('set cache -> ', result);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // [get cache]────────────────────────────────────────────────────────────────────────────────
    async getCacheUser(id: string): Promise<UserDB> {
        const tag = this.getCacheUser.name;
        try {
            const cache = await this.cacheManager.get(`user${id}`);
            this.logger.debug('get cache -> ' , cache)

            if (cache) {
                const _data: UserDB = JSON.parse(JSON.stringify(cache));

                return _data;
            }

            return null;
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // [remove cache]────────────────────────────────────────────────────────────────────────────────
    async removeCacheUser(id: string) {
        const tag = this.removeCacheUser.name;
        try {
            const removeCache = await this.cacheManager.del(`user${id}`);
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async removeAll() {
        const tag = this.removeAll.name;
        try {
            const removeCache = await this.cacheManager.reset();
        } catch (error) {
            this.logger.error(`${tag} -> `, error);
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
