import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../entities/user.entity";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  registrationNumber!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  phone!: string;

  @Column({ nullable: true })
  gender?: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}