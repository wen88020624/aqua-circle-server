import { ApiProperty } from '@nestjs/swagger';
import { TimestampsEntity } from './timestamps.entity';

export class AquariumEntity extends TimestampsEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '我的第一個魚缸' })
  name!: string;

  @ApiProperty({ example: 60 })
  length!: number;

  @ApiProperty({ example: 30 })
  width!: number;

  @ApiProperty({ example: 35 })
  height!: number;

  @ApiProperty({ example: '開缸', description: '開缸、穩定、治療、閒置' })
  status!: string;

  @ApiProperty({ example: '2024-01-01' })
  setupDate!: string;

  @ApiProperty({ required: false, example: '備註' })
  notes?: string | null;
}
