import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  partialTextSearch,
  transformAndValidate,
  getSortDescriptors,
} from '@utils';
import { BaseListResponseDto } from '@types';
import { User } from './entities/user.entity';
import {
  USERS_SEARCH_FIELDS,
  USERS_DEFAULT_PAGE,
  USERS_DEFAULT_PAGE_SIZE,
} from './users.constants';
import { UserResponseDto } from './dto/response';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UsersListQueryDto,
  ChangePasswordDto,
} from './dto/request';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    const { email } = createUserDto;
    const userWithEmailExist = await this.userModel
      .countDocuments({ email })
      .exec();
    if (userWithEmailExist) {
      throw new ForbiddenException(
        `User with email ${email} is already created`,
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel(createUserDto);
    const userCreated = await user.save();
    return transformAndValidate(UserResponseDto, userCreated);
  }

  async findAll(
    listQuery: UsersListQueryDto,
  ): Promise<BaseListResponseDto<UserResponseDto>> {
    const {
      search,
      page = USERS_DEFAULT_PAGE,
      pageSize = USERS_DEFAULT_PAGE_SIZE,
      sort,
    } = listQuery;

    const [total, users] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel
        .find(partialTextSearch(USERS_SEARCH_FIELDS, search))
        .sort(sort && getSortDescriptors(sort))
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
    ]);
    const response: BaseListResponseDto<UserResponseDto> = {
      items: await transformAndValidate(UserResponseDto, users),
      total: total,
    };
    return response;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return transformAndValidate(UserResponseDto, user);
  }

  async changePassword(
    id: string,
    updateUserDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword } = updateUserDto;
    const user = await this.userModel
      .findOne({ _id: id })
      .select('password')
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      throw new UnauthorizedException(`Old password is wrong!`);
    }

    await this.userModel.updateOne(
      { _id: id },
      { password: await bcrypt.hash(newPassword, 10) },
    );
  }

  async update(
    id: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return transformAndValidate(UserResponseDto, existingUser);
  }

  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
