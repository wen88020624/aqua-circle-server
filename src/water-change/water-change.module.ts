import { Module } from '@nestjs/common';
import { WaterChangeService } from './water-change.service';
import { WaterChangeController } from './water-change.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WaterChangeController],
  providers: [WaterChangeService],
})
export class WaterChangeModule {}

