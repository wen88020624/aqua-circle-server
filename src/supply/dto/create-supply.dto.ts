import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplyDto {
  @ApiProperty({ description: '耗材名稱', example: '飼料' })
  name!: string;

  @ApiProperty({ description: 'tag（藥品、濾材、飼料）', example: '飼料' })
  tag!: string;

  @ApiProperty({ description: '數量', example: 10 })
  quantity!: number;

  @ApiProperty({ description: '金額', required: false, example: 100 })
  price?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '購買日期（格式：YYYY-MM-DD）', required: false })
  purchaseDate?: string;

  @ApiProperty({ description: '到期日期（格式：YYYY-MM-DD）', required: false })
  expiryDate?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

export class UpdateSupplyDto {
  @ApiProperty({ description: '耗材名稱', required: false })
  name?: string;

  @ApiProperty({ description: 'tag', required: false })
  tag?: string;

  @ApiProperty({ description: '數量', required: false })
  quantity?: number;

  @ApiProperty({ description: '狀態（使用中、用完、丟棄）', required: false })
  status?: string;

  @ApiProperty({ description: '金額', required: false })
  price?: number;

  @ApiProperty({ description: '備註', required: false })
  notes?: string;

  @ApiProperty({ description: '購買日期', required: false })
  purchaseDate?: string;

  @ApiProperty({ description: '到期日期', required: false })
  expiryDate?: string;

  @ApiProperty({ description: '所屬魚缸 ID', required: false })
  aquariumId?: number;
}

