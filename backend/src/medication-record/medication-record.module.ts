import { Module } from '@nestjs/common';
import { MedicationRecordService } from './medication-record.service';
import { MedicationRecordController } from './medication-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MedicationRecordController],
  providers: [MedicationRecordService],
})
export class MedicationRecordModule {}

