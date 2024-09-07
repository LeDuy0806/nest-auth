import { ApiProperty } from '@nestjs/swagger'

import { RESPONSE_SUCCESS_CODE, RESPONSE_SUCCESS_MSG } from '~/constants/app.constant'

export class SuccessResponse<T = any> {
  @ApiProperty({ type: 'object' })
  data?: T

  @ApiProperty({ type: 'number', default: RESPONSE_SUCCESS_CODE })
  code: number

  @ApiProperty({ type: 'string', default: RESPONSE_SUCCESS_MSG })
  message: string

  constructor(data: T, code: number = RESPONSE_SUCCESS_CODE, message = RESPONSE_SUCCESS_MSG) {
    this.code = code
    this.data = data
    this.message = message
  }

  static success<T>(data?: T, message?: string) {
    return new SuccessResponse(data, RESPONSE_SUCCESS_CODE, message)
  }
}
