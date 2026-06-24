import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationRecordDto, UpdateMedicationRecordDto } from './dto/create-medication-record.dto';

@Injectable()
export class MedicationRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicationRecordDto: CreateMedicationRecordDto) {
    // 驗證下藥名稱不可為空
    if (!createMedicationRecordDto.medicationName || createMedicationRecordDto.medicationName.trim() === '') {
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
        name: createMedicationRecordDto.medicationName,
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
    if (updateMedicationRecordDto.medicationName !== undefined && updateMedicationRecordDto.medicationName.trim() === '') {
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

    const updateData: any = {};
    if (updateMedicationRecordDto.medicationName !== undefined) {
      updateData.name = updateMedicationRecordDto.medicationName;
    }
    if (updateMedicationRecordDto.tag !== undefined) {
      updateData.tag = updateMedicationRecordDto.tag;
    }
    if (updateMedicationRecordDto.dosage !== undefined) {
      updateData.dosage = updateMedicationRecordDto.dosage;
    }
    if (updateMedicationRecordDto.date !== undefined) {
      updateData.date = updateMedicationRecordDto.date;
    }
    if (updateMedicationRecordDto.notes !== undefined) {
      updateData.notes = updateMedicationRecordDto.notes;
    }
    if (updateMedicationRecordDto.aquariumId !== undefined) {
      updateData.aquariumId = updateMedicationRecordDto.aquariumId;
    }

    return this.prisma.medicationRecord.update({
      where: { id },
      data: updateData,
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

