import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { UserEntity } from '~/modules/user/entities'
import { RefreshTokenEntity } from './refresh-token.entity'

@Entity('user_access_tokens')
export class AccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 500 })
  value!: string

  @Column({ comment: 'Token expiration time' })
  expired_at!: Date

  @CreateDateColumn({ comment: 'Token creation time' })
  created_at!: Date

  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.accessToken, {
    cascade: true
  })
  refreshToken!: RefreshTokenEntity

  @ManyToOne(() => UserEntity, (user) => user.accessTokens, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity
}
