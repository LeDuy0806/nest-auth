import { ITokenBase } from './token-base.interface'

export interface IRefreshPayload {
  tokenId: string
}

export interface IRefreshToken extends IRefreshPayload, ITokenBase {}
