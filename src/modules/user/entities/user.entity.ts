import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'
import { Credential } from './credential.entity'

@Entity({
  name: 'users'
})
export class User extends CommonEntity {
  @Column()
  username: string

  @Column()
  email: string

  @Column({
    default: false
  })
  is_verified: boolean

  @OneToOne(() => Credential, (credential) => credential.user, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn()
  credential: Credential
}
