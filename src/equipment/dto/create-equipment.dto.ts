import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({ description: '設備名稱', example: '燈具' })
  name!: string;

  @ApiProperty({ description: 'tag（燈具、過濾器）', example: '燈具' })
  tag!: string;

  @ApiProperty({ description: '狀態（使用中、閒置、賣掉、丟棄）', example: '使用中' })
  status!: string;

  @ApiProperty({ description: '金額', required: false, example: 100 })
  price?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '購買日期（格式：YYYY-MM-DD）', required: false })
  purchaseDate?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

export class UpdateEquipmentDto {
  @ApiProperty({ description: '設備名稱', required: false })
  name?: string;

  @ApiProperty({ description: 'tag', required: false })
  tag?: string;

  @ApiProperty({ description: '狀態', required: false })
  status?: string;

  @ApiProperty({ description: '金額', required: false })
  price?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '購買日期', required: false })
  purchaseDate?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

