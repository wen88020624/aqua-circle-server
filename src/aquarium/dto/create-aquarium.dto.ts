import { ApiProperty } from '@nestjs/swagger';

export class CreateAquariumDto {
  @ApiProperty({ description: '魚缸名稱', example: '我的第一個魚缸' })
  name!: string;

  @ApiProperty({ description: '魚缸長度（公分）', example: 60 })
  length!: number;

  @ApiProperty({ description: '魚缸寬度（公分）', example: 30 })
  width!: number;

  @ApiProperty({ description: '魚缸高度（公分）', example: 35 })
  height!: number;

  @ApiProperty({ description: '魚缸狀態', example: '開缸' })
  status!: string;

  @ApiProperty({ description: '設置日期', example: '2024-01-01' })
  setupDate!: string;

  @ApiProperty({ description: '備註', required: false, example: '這是我的第一個魚缸' })
  notes?: string;
}

