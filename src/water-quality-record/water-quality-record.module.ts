import { Module } from '@nestjs/common';
import { WaterQualityRecordService } from './water-quality-record.service';
import { WaterQualityRecordController } from './water-quality-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WaterQualityRecordController],
  providers: [WaterQualityRecordService],
})
export class WaterQualityRecordModule {}

