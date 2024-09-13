import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { AccessTokenEntity } from './access-token.entity'

@Entity('user_refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 500 })
  value!: string

  @Column({ comment: 'Token expiration time' })
  expired_at!: Date

  @CreateDateColumn({ comment: 'Token creation time' })
  created_at!: Date

  @OneToOne(() => AccessTokenEntity, (accessToken) => accessToken.refreshToken, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  accessToken!: AccessTokenEntity
}
