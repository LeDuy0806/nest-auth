import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user'
  })
  username: string

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'The email of the user'
  })
  email: string

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user'
  })
  password: string
}
