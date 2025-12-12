import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganismDto {
  @ApiProperty({ description: '生物名稱', example: '小丑魚' })
  name!: string;

  @ApiProperty({ description: 'tag（上層魚、底棲魚、異形、古代魚、蝦...）', example: '上層魚' })
  tag!: string;

  @ApiProperty({ description: '購買日期（格式：YYYY-MM-DD）', required: false, example: '2025-01-01' })
  purchaseDate?: string;

  @ApiProperty({ description: '金額', required: false, example: 100 })
  price?: number;

  @ApiProperty({ description: '健康程度（過胖、過瘦、正常、生病、精神異常、死亡）', required: false, example: '正常' })
  healthStatus?: string;

  @ApiProperty({ description: '性別（雄、雌）', required: false, example: '雄' })
  gender?: string;

  @ApiProperty({ description: '長度（公分）', required: false, example: 10 })
  length?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', example: 1 })
  aquariumId!: number;
}

export class UpdateOrganismDto {
  @ApiProperty({ description: '生物名稱', required: false })
  name?: string;

  @ApiProperty({ description: 'tag', required: false })
  tag?: string;

  @ApiProperty({ description: '購買日期', required: false })
  purchaseDate?: string;

  @ApiProperty({ description: '金額', required: false })
  price?: number;

  @ApiProperty({ description: '健康程度', required: false })
  healthStatus?: string;

  @ApiProperty({ description: '性別', required: false })
  gender?: string;

  @ApiProperty({ description: '長度（公分）', required: false })
  length?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

