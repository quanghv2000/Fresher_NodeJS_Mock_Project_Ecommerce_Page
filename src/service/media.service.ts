import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaDTO } from './dto/media.dto';
import { MediaMapper } from './mapper/media.mapper';
import { MediaRepository } from '../repository/media.repository';

@Injectable()
export class MediaService {
    constructor(@InjectRepository(MediaRepository) private mediaRepository: MediaRepository) {}

    async findAll(): Promise<MediaDTO[]> {
        const medias = await this.mediaRepository.find();

        const mediasDTO: MediaDTO[] = [];

        medias.forEach((media) => {
            mediasDTO.push(MediaMapper.fromEntityToDTO(media))
        })

        return mediasDTO;
    }

    async findById(id: number): Promise<MediaDTO | undefined> {
        const media = await this.mediaRepository.findOne(id);

        return MediaMapper.fromEntityToDTO(media);
    }

    async findByProductId(productId: number): Promise<MediaDTO[] | undefined> {
        const medias = await this.mediaRepository.find({
            where: {
                product: {
                    id: productId,
                }
            }
        });

        const mediasDTO: MediaDTO[] = [];

        medias.forEach((media) => {
            mediasDTO.push(MediaMapper.fromEntityToDTO(media))
        })

        return mediasDTO;
    }

    async save(mediaDTO: MediaDTO): Promise<MediaDTO | undefined> {
        const newMedia = MediaMapper.fromDTOtoEntity(mediaDTO);
        const mediaCreated = await this.mediaRepository.save(newMedia);

        return MediaMapper.fromEntityToDTO(mediaCreated);
    }

    async update(mediaDTO: MediaDTO): Promise<MediaDTO | undefined> {
        const mediaToUpdate = MediaMapper.fromDTOtoEntity(mediaDTO);
        const mediaUpdated = await this.mediaRepository.save(mediaToUpdate);

        return MediaMapper.fromEntityToDTO(mediaUpdated);
    }

    async delete(mediaDTO: MediaDTO): Promise<MediaDTO | undefined> {
        const mediaToDelete = MediaMapper.fromDTOtoEntity(mediaDTO);
        const mediaDeleted = await this.mediaRepository.remove(mediaToDelete);

        return MediaMapper.fromEntityToDTO(mediaDeleted);
    }

    async count(): Promise<number> {
        return await this.mediaRepository.count();
    }

}
