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

  @Column({
    type: "enum",
    enum: ["STUDENT", "ADMIN"],
    default: "STUDENT",
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}
