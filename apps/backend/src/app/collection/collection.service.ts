import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection, CollectionItem } from '@backend/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as UUID from 'uuid';
import { createDirectory, moveFile } from '@backend/utils/file';
import { createSlug } from '@backend/utils/string';
import { plainToClass } from 'class-transformer';
import {
  CollectionDetailDto,
  CollectionItemDto,
} from './dto/collection-detail.dto';
import * as fs from 'fs';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const collection = this.collectionRepository.create(createCollectionDto);
    return this.collectionRepository.save(collection);
  }

  findAll() {
    return this.collectionRepository.find();
  }

  async findOne(id: number) {
    const collection = await this.collectionRepository.findOne({
      where: { id },
    });

    if (!collection) throw new NotFoundException('Collection not found');

    const items = await this.collectionItemRepository.find({
      where: { collectionId: id },
    });
    console.log('items', items);
    const result = plainToClass(CollectionDetailDto, collection);
    result.items = items.map((item) => plainToClass(CollectionItemDto, item));
    console.log('result', result);
    return result;
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    await this.collectionRepository.update(id, updateCollectionDto);
  }

  async remove(id: number) {
    await this.collectionItemRepository.delete({ collectionId: id });

    await this.collectionRepository.delete(id);
  }

  async addFile(collectionId: number, file: Express.Multer.File) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const key = UUID.v4();

    // new file name = /collectionId/key.extension
    const extension = file.originalname.split('.').pop();
    const savePath = `files-saved/${collectionId}/${key}.${
      extension || 'file'
    }`;

    moveFile(file.path, savePath);

    const collectionItem = this.collectionItemRepository.create({
      collectionId,
      name: file.originalname,
      savePath: savePath,
    });

    return this.collectionItemRepository.save(collectionItem);
  }

  async addFiles(collectionId: number, files: Express.Multer.File[]) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    for (const file of files) {
      const key = UUID.v4();

      // new file name = /collectionId/key.extension
      const extension = file.originalname.split('.').pop();
      const savePath = `files-saved/${collectionId}/${key}.${
        extension || 'file'
      }`;

      moveFile(file.path, savePath);

      const collectionItem = this.collectionItemRepository.create({
        collectionId,
        name: file.originalname,
        savePath: savePath,
      });

      await this.collectionItemRepository.save(collectionItem);
    }
  }

  async addText(collectionId: number, text: string) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const key = UUID.v4();
    const name = createSlug(text.substring(0, 20)) + '.txt';
    // new file name = /collectionId/key.txt
    const dir = `files-saved/${collectionId}`;
    const savePath = `${dir}/${key}.txt`;

    createDirectory(dir);

    // write text to file

    fs.writeFileSync(savePath, text);

    const collectionItem = this.collectionItemRepository.create({
      collectionId,
      name: name,
      savePath: savePath,
    });

    return this.collectionItemRepository.save(collectionItem);
  }

  async deleteCollectionItem(collectionItemId: number) {
    const collectionItem = await this.collectionItemRepository.findOne({
      where: { id: collectionItemId },
    });
    if (!collectionItem) {
      throw new NotFoundException('Collection item not found');
    }
    try {
      fs.unlinkSync(collectionItem.savePath);
    } catch (e) {
      console.error(e);
    }

    await this.collectionItemRepository.delete(collectionItemId);
  }
}
