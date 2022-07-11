import { Module } from '@nestjs/common';
import { MediaController } from '../web/rest/media.controller';
import { ManagementController } from '../web/rest/management.controller';
import { MediaRepository } from '../repository/media.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from '../service/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaRepository])],
  controllers: [MediaController, ManagementController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
