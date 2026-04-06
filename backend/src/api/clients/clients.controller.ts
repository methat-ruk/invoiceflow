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
import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';

interface RequestWithUser extends Request {
  user: { id: string; email: string; name: string };
}

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.clients.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.clients.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateClientDto, @Request() req: RequestWithUser) {
    return this.clients.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @Request() req: RequestWithUser,
  ) {
    return this.clients.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.clients.remove(id, req.user.id);
  }
}
