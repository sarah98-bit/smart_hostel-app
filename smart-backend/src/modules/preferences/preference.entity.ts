import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "../../entities/user.entity";

@Entity("preferences")
export class Preference {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  sleepTime!: string;

  @Column()
  studyHabit!: string;

  @Column()
  visitorTolerance!: string;

  @OneToOne(() => User, {eager: true})
  @JoinColumn()
  student!: User;
}
