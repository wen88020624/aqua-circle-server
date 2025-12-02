import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AquariumModule } from './aquarium/aquarium.module';
import { WaterChangeModule } from './water-change/water-change.module';
import { OrganismModule } from './organism/organism.module';

@Module({
  imports: [PrismaModule, AquariumModule, WaterChangeModule, OrganismModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

