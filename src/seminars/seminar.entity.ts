import { BaseEntity } from 'src/helpers/base.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Seminar extends BaseEntity {
  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'int4' })
  quota: number;

  @ManyToOne(() => User, (user) => user.seminars)
  user: User;

  @ManyToMany(() => User)
  @JoinTable()
  attendance: User[];
}
