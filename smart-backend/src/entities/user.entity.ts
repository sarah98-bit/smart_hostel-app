import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export type UserRole = "STUDENT" | "ADMIN";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "varchar", default: "STUDENT" })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}
