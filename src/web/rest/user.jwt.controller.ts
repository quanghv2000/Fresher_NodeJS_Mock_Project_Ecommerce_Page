import {
    Body,
    Controller,
    Logger,
    Post,
    Res,
    Req,
    UseInterceptors,
    Inject,
    CACHE_MANAGER,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { AuthService } from '../../service/auth.service';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Payload } from '../../security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { UserDTO } from 'src/service/dto/user.dto';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
@ApiUseTags('user-jwt-controller')
export class UserJWTController {
    logger = new Logger('UserJWTController');

    constructor(
        private readonly authService: AuthService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly jwtService: JwtService,
    ) {}

    @Post('/authenticate')
    @ApiOperation({ title: 'Authorization api retrieving token' })
    @ApiResponse({
        status: 201,
        description: 'Authorized',
    })
    async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.login(user);
        res.setHeader('Authorization', 'Bearer ' + jwt.access_token);
        return res.json(jwt);
    }

    @Post('/refresh-token')
    @ApiOperation({ title: 'Authorization api refresh token' })
    @ApiResponse({
        status: 201,
        description: 'Authorized',
    })
    async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
        const refreshTokenReq = req.headers.authorization.split(' ')[1];
        let user;
        try {
            user = await this.jwtService.verify(refreshTokenReq);
        } catch (error) {
            throw new HttpException('Invalid refresh token!', HttpStatus.BAD_REQUEST);
        }

        const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };
        const refreshTokenFound = await this.cacheManager.get(`refresh_token_${payload.id}`);

        if (!refreshTokenFound || refreshTokenReq !== refreshTokenFound) {
            throw new HttpException('Invalid refresh token!', HttpStatus.BAD_REQUEST);
        }

        const access_token = this.jwtService.sign(payload); // secret and expiresIn has config in auth.module
        res.setHeader('Authorization', 'Bearer ' + access_token);

        return res.json({ access_token });
    }

    @Post('/logout')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Authorization api logout' })
    @ApiResponse({
        status: 201,
        description: 'Logout',
    })
    async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
        const userReq: any = req.user;
        await this.cacheManager.del(`refresh_token_${userReq.id}`);

        return res.json({
            message: 'Logout successfully!',
        });
    }
}
