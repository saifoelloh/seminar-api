import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/helpers/base.entity';
import { Seminar } from 'src/seminars/seminar.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @OneToMany(() => Seminar, (seminar) => seminar.user)
  seminars: Seminar[];

  @BeforeInsert()
  async hashPassword() {
    const saltRound = parseInt(process.env.APP_SALT);
    const salt = await bcrypt.genSalt(saltRound);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
