import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaterQualityRecordDto, UpdateWaterQualityRecordDto } from './dto/create-water-quality-record.dto';

@Injectable()
export class WaterQualityRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createWaterQualityRecordDto: CreateWaterQualityRecordDto) {
    // 驗證檢測種類不可為空
    if (!createWaterQualityRecordDto.testType || createWaterQualityRecordDto.testType.trim() === '') {
      throw new BadRequestException('水質檢測記錄的檢測種類不可為空');
    }

    // 驗證檢測日期不可為空
    if (!createWaterQualityRecordDto.testDate || createWaterQualityRecordDto.testDate.trim() === '') {
      throw new BadRequestException('水質檢測記錄的檢測日期不可為空');
    }

    // 驗證數值不可為空
    if (createWaterQualityRecordDto.value === undefined || createWaterQualityRecordDto.value === null) {
      throw new BadRequestException('水質檢測記錄的數值不可為空');
    }

    // 驗證所屬魚缸不可為空
    if (!createWaterQualityRecordDto.aquariumId) {
      throw new BadRequestException('水質檢測記錄的所屬魚缸不可為空');
    }

    // 驗證魚缸是否存在
    const aquarium = await this.prisma.aquarium.findUnique({
      where: { id: createWaterQualityRecordDto.aquariumId },
    });

    if (!aquarium) {
      throw new BadRequestException('所屬魚缸不存在');
    }

    return this.prisma.waterQualityRecord.create({
      data: {
        testType: createWaterQualityRecordDto.testType,
        testDate: createWaterQualityRecordDto.testDate,
        value: createWaterQualityRecordDto.value,
        notes: createWaterQualityRecordDto.notes,
        aquariumId: createWaterQualityRecordDto.aquariumId,
      },
    });
  }

  async findAll() {
    return this.prisma.waterQualityRecord.findMany({
      include: {
        aquarium: true,
      },
    });
  }

  async update(id: number, updateWaterQualityRecordDto: UpdateWaterQualityRecordDto) {
    const existing = await this.prisma.waterQualityRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('水質檢測記錄不存在');
    }

    // 驗證檢測種類不可為空（如果提供）
    if (updateWaterQualityRecordDto.testType !== undefined && updateWaterQualityRecordDto.testType.trim() === '') {
      throw new BadRequestException('水質檢測記錄的檢測種類不可為空');
    }

    // 驗證檢測日期不可為空（如果提供）
    if (updateWaterQualityRecordDto.testDate !== undefined && updateWaterQualityRecordDto.testDate.trim() === '') {
      throw new BadRequestException('水質檢測記錄的檢測日期不可為空');
    }

    // 驗證數值不可為空（如果提供）
    if (updateWaterQualityRecordDto.value !== undefined && updateWaterQualityRecordDto.value === null) {
      throw new BadRequestException('水質檢測記錄的數值不可為空');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateWaterQualityRecordDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateWaterQualityRecordDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    return this.prisma.waterQualityRecord.update({
      where: { id },
      data: {
        testType: updateWaterQualityRecordDto.testType,
        testDate: updateWaterQualityRecordDto.testDate,
        value: updateWaterQualityRecordDto.value,
        notes: updateWaterQualityRecordDto.notes,
        aquariumId: updateWaterQualityRecordDto.aquariumId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.waterQualityRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('水質檢測記錄不存在');
    }

    return this.prisma.waterQualityRecord.delete({
      where: { id },
    });
  }
}

