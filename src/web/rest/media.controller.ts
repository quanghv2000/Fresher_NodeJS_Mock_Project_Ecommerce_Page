import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { MediaDTO } from '../../service/dto/media.dto';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MediaService } from '../../service/media.service';

@Controller('api/media')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
// @UseGuards(AuthGuard, RolesGuard)
// @ApiBearerAuth()
@ApiUseTags('media-resource')
export class MediaController {
    logger = new Logger('MediaController');

    constructor(private readonly mediaService: MediaService) {}

    @Get('/get-all')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of medias' })
    @ApiResponse({
        status: 200,
        description: 'List all medias',
        type: MediaDTO,
    })
    async getAllMedias(@Req() req: Request): Promise<MediaDTO[]> {
        const medias = await this.mediaService.findAll();

        return medias;
    }

    @Get('/get-by-id/:id')
    // @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of medias' })
    @ApiResponse({
        status: 200,
        description: 'List all medias',
        type: MediaDTO,
    })
    async getMediaById(@Param('id', ParseIntPipe) id: number): Promise<MediaDTO> {
        const mediaFound = await this.mediaService.findById(id);

        if (!mediaFound) {
            throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
        }

        return mediaFound;
    }

    @Post('/create')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create media' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: MediaDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createMedia(@Req() req: Request, @Body() mediaDTO: MediaDTO): Promise<MediaDTO> {
        const userReq = req.user?.login;
        mediaDTO.createdBy = userReq;
        const mediaCreated = await this.mediaService.save(mediaDTO);

        return mediaCreated;
    }

    @Put('/update')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update media' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MediaDTO,
    })
    async updateMedia(@Req() req: Request, @Body() mediaDTO: MediaDTO): Promise<MediaDTO> {
        const mediaFoundById = await this.mediaService.findById(mediaDTO.id);

        if (!mediaFoundById) {
            throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
        }

        const userReq = req.user?.login;
        mediaDTO.lastModifiedBy = userReq;

        const mediaUpdated = await this.mediaService.update(mediaDTO);

        return mediaUpdated;
    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete media' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
        type: MediaDTO,
    })
    async deleteMedia(@Param('id') id: number): Promise<MediaDTO> {
        const mediaToDelete = await this.mediaService.findById(id);

        if (!mediaToDelete) {
            throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
        }

        return await this.mediaService.delete(mediaToDelete);
    }
}
