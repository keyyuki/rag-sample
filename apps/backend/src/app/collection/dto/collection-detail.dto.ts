import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CollectionDetailDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  items: CollectionItemDto[];
}

@Exclude()
export class CollectionItemDto {
  @Expose()
  id: number;

  @Expose()
  collectionId: number;

  @Expose()
  name: string;

  @Expose()
  downloadUrl: string;

  @Expose()
  createdAt: Date;
}
