import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedingRecordDto, UpdateFeedingRecordDto } from './dto/create-feeding-record.dto';

@Injectable()
export class FeedingRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedingRecordDto: CreateFeedingRecordDto) {
    // 驗證日期不可為空
    if (!createFeedingRecordDto.date || createFeedingRecordDto.date.trim() === '') {
      throw new BadRequestException('餵食記錄的日期不可為空');
    }

    // 驗證所屬魚缸必須存在
    const aquarium = await this.prisma.aquarium.findUnique({
      where: { id: createFeedingRecordDto.aquariumId },
    });

    if (!aquarium) {
      throw new BadRequestException('所屬魚缸不存在');
    }

    // 驗證耗材必須存在且 tag 為「飼料」
    const supply = await this.prisma.supply.findUnique({
      where: { id: createFeedingRecordDto.supplyId },
    });

    if (!supply) {
      throw new BadRequestException('耗材不存在');
    }

    if (supply.tag !== '飼料') {
      throw new BadRequestException('只能選擇 tag 為「飼料」的耗材');
    }

    // 檢查是否過期（如果到期日期存在且已過期）
    let warningMessage: string | undefined;
    if (supply.expiryDate) {
      const expiryDate = new Date(supply.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        warningMessage = '飼料已過期，請注意生物健康';
      }
    }

    const record = await this.prisma.feedingRecord.create({
      data: {
        date: createFeedingRecordDto.date,
        supplyId: createFeedingRecordDto.supplyId,
        notes: createFeedingRecordDto.notes,
        aquariumId: createFeedingRecordDto.aquariumId,
      },
      include: {
        supply: true,
        aquarium: true,
      },
    });

    // 如果有警告訊息，將其附加到返回結果
    return {
      ...record,
      warning: warningMessage,
    };
  }

  async findAll() {
    return this.prisma.feedingRecord.findMany({
      include: {
        supply: true,
        aquarium: true,
      },
    });
  }

  async findByAquarium(aquariumId: number) {
    return this.prisma.feedingRecord.findMany({
      where: { aquariumId },
      include: {
        supply: true,
        aquarium: true,
      },
    });
  }

  async update(id: number, updateFeedingRecordDto: UpdateFeedingRecordDto) {
    // 檢查記錄是否存在
    const existing = await this.prisma.feedingRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('餵食記錄不存在');
    }

    // 如果更新日期，驗證不可為空
    if (updateFeedingRecordDto.date !== undefined && (updateFeedingRecordDto.date === null || updateFeedingRecordDto.date.trim() === '')) {
      throw new BadRequestException('餵食記錄的日期不可為空');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateFeedingRecordDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateFeedingRecordDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    // 如果更新耗材ID，驗證耗材是否存在且 tag 為「飼料」
    if (updateFeedingRecordDto.supplyId) {
      const supply = await this.prisma.supply.findUnique({
        where: { id: updateFeedingRecordDto.supplyId },
      });

      if (!supply) {
        throw new BadRequestException('耗材不存在');
      }

      if (supply.tag !== '飼料') {
        throw new BadRequestException('只能選擇 tag 為「飼料」的耗材');
      }
    }

    return this.prisma.feedingRecord.update({
      where: { id },
      data: {
        date: updateFeedingRecordDto.date,
        supplyId: updateFeedingRecordDto.supplyId,
        notes: updateFeedingRecordDto.notes,
        aquariumId: updateFeedingRecordDto.aquariumId,
      },
      include: {
        supply: true,
        aquarium: true,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.feedingRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('餵食記錄不存在');
    }

    return this.prisma.feedingRecord.delete({
      where: { id },
    });
  }
}

