import { Column, Entity, JoinColumn, OneToMany, OneToOne, Unique } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'
import { AccessTokenEntity } from '~/modules/auth/entities/access-token.entity'
import { CredentialEntity } from './credential.entity'

@Entity({
  name: 'users'
})
export class UserEntity extends CommonEntity {
  @Column()
  username: string

  @Column()
  @Unique(['email'])
  email: string

  @Column({
    default: false
  })
  is_verified: boolean

  @OneToOne(() => CredentialEntity, (credential) => credential.user, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn()
  credential: CredentialEntity

  @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
    cascade: true
  })
  accessTokens: AccessTokenEntity[]
}
