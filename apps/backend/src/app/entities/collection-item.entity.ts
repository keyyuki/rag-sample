import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

@Entity('collection_items')
export class CollectionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  collectionId: number;

  @Column()
  name: string;

  @Column()
  savePath: string;

  @CreateDateColumn()
  createdAt: Date;
}
