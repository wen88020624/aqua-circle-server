import { Module } from '@nestjs/common';
import { OrganismService } from './organism.service';
import { OrganismController } from './organism.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrganismController],
  providers: [OrganismService],
})
export class OrganismModule {}

