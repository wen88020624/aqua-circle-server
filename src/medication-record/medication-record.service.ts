import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationRecordDto, UpdateMedicationRecordDto } from './dto/create-medication-record.dto';

@Injectable()
export class MedicationRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicationRecordDto: CreateMedicationRecordDto) {
    // 驗證下藥名稱不可為空
    if (!createMedicationRecordDto.name || createMedicationRecordDto.name.trim() === '') {
      throw new BadRequestException('下藥記錄的下藥名稱不可為空');
    }

    // 驗證tag不可為空
    if (!createMedicationRecordDto.tag || createMedicationRecordDto.tag.trim() === '') {
      throw new BadRequestException('下藥記錄的tag不可為空');
    }

    // 驗證下藥的量不可為空
    if (createMedicationRecordDto.dosage === undefined || createMedicationRecordDto.dosage === null) {
      throw new BadRequestException('下藥記錄的下藥的量不可為空');
    }

    // 驗證所屬魚缸不可為空
    if (!createMedicationRecordDto.aquariumId) {
      throw new BadRequestException('下藥記錄的所屬魚缸不可為空');
    }

    // 驗證魚缸是否存在
    const aquarium = await this.prisma.aquarium.findUnique({
      where: { id: createMedicationRecordDto.aquariumId },
    });

    if (!aquarium) {
      throw new BadRequestException('所屬魚缸不存在');
    }

    return this.prisma.medicationRecord.create({
      data: {
        name: createMedicationRecordDto.name,
        tag: createMedicationRecordDto.tag,
        dosage: createMedicationRecordDto.dosage,
        date: createMedicationRecordDto.date,
        notes: createMedicationRecordDto.notes,
        aquariumId: createMedicationRecordDto.aquariumId,
      },
    });
  }

  async findAll() {
    return this.prisma.medicationRecord.findMany({
      include: {
        aquarium: true,
      },
    });
  }

  async update(id: number, updateMedicationRecordDto: UpdateMedicationRecordDto) {
    const existing = await this.prisma.medicationRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('下藥記錄不存在');
    }

    // 驗證下藥名稱不可為空（如果提供）
    if (updateMedicationRecordDto.name !== undefined && updateMedicationRecordDto.name.trim() === '') {
      throw new BadRequestException('下藥記錄的下藥名稱不可為空');
    }

    // 驗證tag不可為空（如果提供）
    if (updateMedicationRecordDto.tag !== undefined && updateMedicationRecordDto.tag.trim() === '') {
      throw new BadRequestException('下藥記錄的tag不可為空');
    }

    // 驗證下藥的量不可為空（如果提供）
    if (updateMedicationRecordDto.dosage !== undefined && updateMedicationRecordDto.dosage === null) {
      throw new BadRequestException('下藥記錄的下藥的量不可為空');
    }

    // 如果更新魚缸ID，驗證魚缸是否存在
    if (updateMedicationRecordDto.aquariumId) {
      const aquarium = await this.prisma.aquarium.findUnique({
        where: { id: updateMedicationRecordDto.aquariumId },
      });

      if (!aquarium) {
        throw new BadRequestException('所屬魚缸不存在');
      }
    }

    return this.prisma.medicationRecord.update({
      where: { id },
      data: {
        name: updateMedicationRecordDto.name,
        tag: updateMedicationRecordDto.tag,
        dosage: updateMedicationRecordDto.dosage,
        date: updateMedicationRecordDto.date,
        notes: updateMedicationRecordDto.notes,
        aquariumId: updateMedicationRecordDto.aquariumId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.medicationRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('下藥記錄不存在');
    }

    return this.prisma.medicationRecord.delete({
      where: { id },
    });
  }
}

