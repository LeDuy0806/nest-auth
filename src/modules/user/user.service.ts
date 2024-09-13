import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { EntityManager, Repository } from 'typeorm'
import { hashPassword } from '~/utils/password.util'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CredentialEntity, UserEntity } from './entities'

@Injectable()
export class UserService {
  constructor(
    //inject repository for user entity
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    //inject repository for credential entity
    @InjectRepository(CredentialEntity)
    private credentialRepository: Repository<CredentialEntity>
  ) {}

  async create({ email, password, username }: CreateUserDto) {
    // const exists = await this.userRepository.findOne({
    //   where: [{ email }, { username }]
    // })

    // if (!isEmpty(exists)) {
    //   throw new BadRequestException(ErrorMessageEnum.USER_ALREADY_EXISTS)
    // }

    const hashedPassword = await hashPassword(password || '123456')
    //create new credential

    return await this.userRepository.manager.transaction(async (entityManager: EntityManager) => {
      // Create the user entity
      const user = this.userRepository.create({
        email,
        username
      })

      // Save user inside the transaction
      const savedUser = await entityManager.save(user)

      // Ensure user ID exists after saving
      if (!savedUser.id) {
        throw new BadRequestException('Failed to create user.')
      }

      // Create the credential with user ID
      const credential = this.credentialRepository.create({
        password: hashedPassword,
        user: savedUser
      })

      // Save credential inside the transaction
      await entityManager.save(credential)

      savedUser.credential = credential

      await entityManager.save(savedUser)

      return await entityManager.findOne(UserEntity, {
        where: { id: savedUser.id }
      })
    })
  }

  async findOne<T = string>(key: keyof UserEntity, value: T): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        [key]: value
      }
    })

    if (isEmpty(user)) {
      throw new NotFoundException(`User with ${key} ${value} not found`)
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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

  async findUserByEmailOrUsername(username: string) {
    return await this.userRepository.findOne({
      where: [{ email: username }, { username }]
    })
  }

  async findUserByEmail(email: string) {
    return await this.findOne('email', email)
  }

  async findUserByUsername(username: string) {
    return await this.findOne('username', username)
  }

  async findCredentialByUserId(user_id: string) {
    return await this.credentialRepository.findOne({
      where: {
        user: {
          id: user_id
        }
      }
    })
  }
}
