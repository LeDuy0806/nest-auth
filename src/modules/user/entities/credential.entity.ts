import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'
import { User } from './user.entity'

@Entity({
  name: 'credentials'
})
export class Credential extends CommonEntity {
  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'user_id'
  })
  user: User

  @Column()
  password: string

  @Column({ nullable: true })
  google_id: string

  @Column({ nullable: true })
  facebook_id: string
}
