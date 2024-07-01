import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddTextDto } from './dto/add-text.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ) {
    return this.collectionService.update(+id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionService.remove(+id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':id/file')
  addFile(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /application\/(pdf|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword)|text\/(csv|plain|html|markdown)/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 20, // 4MB
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    files: Express.Multer.File[]
  ) {
    return this.collectionService.addFiles(+id, files);
  }

  @Post(':id/text')
  addText(@Param('id') id: string, @Body() dto: AddTextDto) {
    return this.collectionService.addText(+id, dto.content);
  }

  @Delete(':id/file/:fileId')
  deleteCollectionItem(
    @Param('id') id: string,
    @Param('fileId') fileId: string
  ) {
    return this.collectionService.deleteCollectionItem(+fileId);
  }
}
