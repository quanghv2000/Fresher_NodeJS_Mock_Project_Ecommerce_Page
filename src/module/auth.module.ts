import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController } from '../web/rest/user.jwt.controller';
import { config } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';

import { PublicUserController } from '../web/rest/public.user.controller';
import { AccountController } from '../web/rest/account.controller';

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
        }),
        TypeOrmModule.forFeature([AuthorityRepository]),
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: config['jhipster.security.authentication.jwt.base64-secret'],
            signOptions: { expiresIn: '3600s' },
        }),
    ],
    controllers: [UserJWTController, PublicUserController, AccountController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
