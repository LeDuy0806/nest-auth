import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from './user.entity'

@Entity({
  name: 'credentials'
})
export class CredentialEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'user_id'
  })
  user: UserEntity

  @Column()
  password: string

  @Column({ nullable: true })
  google_id: string

  @Column({ nullable: true })
  facebook_id: string
}
