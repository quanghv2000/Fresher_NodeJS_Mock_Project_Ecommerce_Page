import { EntityRepository, Repository } from 'typeorm';
import { Media } from '../domain/media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {}
