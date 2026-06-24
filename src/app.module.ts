import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AquariumModule } from './aquarium/aquarium.module';
import { WaterChangeModule } from './water-change/water-change.module';
import { OrganismModule } from './organism/organism.module';
import { FeedingRecordModule } from './feeding-record/feeding-record.module';
import { SupplyModule } from './supply/supply.module';
import { MedicationRecordModule } from './medication-record/medication-record.module';
import { WaterQualityRecordModule } from './water-quality-record/water-quality-record.module';
import { EquipmentModule } from './equipment/equipment.module';

@Module({
  imports: [
    PrismaModule,
    AquariumModule,
    WaterChangeModule,
    OrganismModule,
    FeedingRecordModule,
    SupplyModule,
    MedicationRecordModule,
    WaterQualityRecordModule,
    EquipmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

