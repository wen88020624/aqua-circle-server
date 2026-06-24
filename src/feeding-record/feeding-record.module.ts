import { Module } from '@nestjs/common';
import { FeedingRecordService } from './feeding-record.service';
import { FeedingRecordController } from './feeding-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeedingRecordController],
  providers: [FeedingRecordService],
})
export class FeedingRecordModule {}

