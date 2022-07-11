import { Media } from '../../domain/media.entity';
import { MediaDTO } from '../dto/media.dto';

/**
 * An Media mapper object.
 */
export class MediaMapper {
    static fromDTOtoEntity(mediaDTO: MediaDTO): Media {
        if (!mediaDTO) {
            return;
        }
        const media = new Media();
        const fields = Object.getOwnPropertyNames(mediaDTO);
        fields.forEach(field => {
            media[field] = mediaDTO[field];
        });
        return media;
    }

    static fromEntityToDTO(media: Media): MediaDTO {
        if (!media) {
            return;
        }
        const mediaDTO = new MediaDTO();

        const fields = Object.getOwnPropertyNames(media);

        fields.forEach(field => {
            mediaDTO[field] = media[field];
        });

        return mediaDTO;
    }
}
