import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection, CollectionItem } from '@backend/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, CollectionItem])],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
