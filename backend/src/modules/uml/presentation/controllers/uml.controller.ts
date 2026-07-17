import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UmlService } from '../../application/services/uml.service';
import { CreateUmlDto } from '../../application/dto/create-uml.dto';
import { UpdateUmlDto } from '../../application/dto/update-uml.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Uml')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('uml')
export class UmlController {
  constructor(private readonly service: UmlService) {}

  @Post()
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Create new uml record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateUmlDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get all uml records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DEVELOPER', 'VIEWER')
  @ApiOperation({ summary: 'Get uml record by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Update uml record' })
  update(@Param('id') id: string, @Body() dto: UpdateUmlDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete uml record' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
