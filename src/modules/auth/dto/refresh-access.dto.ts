import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsOptional, IsString } from 'class-validator'

export abstract class RefreshAccessDto {
  @ApiProperty({
    description: 'The JWT token sent to the user email',
    example: 'ey...',
    type: String
  })
  @IsOptional()
  @IsString()
  @IsJWT()
  public refreshToken?: string
}
