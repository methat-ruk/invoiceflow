import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';

interface RequestWithUser extends Request {
  user: { id: string; email: string; name: string };
}

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.invoices.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.invoices.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto, @Request() req: RequestWithUser) {
    return this.invoices.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.invoices.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.invoices.remove(id, req.user.id);
  }
}
