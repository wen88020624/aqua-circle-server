import { Module } from '@nestjs/common';
import { AquariumService } from './aquarium.service';
import { AquariumController } from './aquarium.controller';

@Module({
  controllers: [AquariumController],
  providers: [AquariumService],
  exports: [AquariumService],
})
export class AquariumModule {}

