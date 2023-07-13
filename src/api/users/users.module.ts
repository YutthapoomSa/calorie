import { BmiService } from './../bmi/service/bmi.service';
import { SharedModule } from './../../shared/shared.module';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './auth/jwt-strategy';
import { ApiUsersService } from './services/api-users.service';
import { CacheUsersService } from './services/cache-users.service';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [SharedModule, ],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy, ApiUsersService, CacheUsersService, BmiService],
    exports: [UsersService],
})
export class UsersModule {}
