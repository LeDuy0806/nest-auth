import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { isEmpty } from 'lodash'

@Injectable()
export class UserService {
  constructor(
    //inject repository for user entity
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto)
  }

  findAll() {
    return `This action returns all user`
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    })

    if (isEmpty(user)) {
      throw new NotFoundException(`User #${id} not found`)
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id }
    })

    if (isEmpty(user)) {
      throw new NotFoundException(`User #${id} not found`)
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
