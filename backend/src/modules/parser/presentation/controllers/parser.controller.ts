import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ParserService } from '../../application/services/parser.service';
import { CreateParserDto } from '../../application/dto/create-parser.dto';
import { UpdateParserDto } from '../../application/dto/update-parser.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Parser')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parser')
export class ParserController {
  constructor(private readonly service: ParserService) {}

  @Post()
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Create new parser record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateParserDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get all parser records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get parser record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Update parser record' })
  update(@Param('id') id: string, @Body() dto: UpdateParserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete parser record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
