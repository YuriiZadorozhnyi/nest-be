import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequestExtended, BaseListResponseDto } from '@types';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/response';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UsersListQueryDto,
  ChangePasswordDto,
} from './dto/request';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserRequestDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() listQuery: UsersListQueryDto,
  ): Promise<BaseListResponseDto<UserResponseDto>> {
    return this.usersService.findAll(listQuery);
  }

  @Get('/me')
  findMe(@Request() request: RequestExtended): Promise<UserResponseDto> {
    return this.usersService.findOne(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put('/:id/passwords')
  @HttpCode(HttpStatus.ACCEPTED)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(id, changePasswordDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<void> {
    await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
