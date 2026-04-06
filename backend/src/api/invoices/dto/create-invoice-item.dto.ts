import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsString()
  @MinLength(1)
  description!: string;

  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
