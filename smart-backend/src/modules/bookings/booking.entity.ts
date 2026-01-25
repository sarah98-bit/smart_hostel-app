import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";

import { User } from "../../entities/user.entity";
import { Hostel } from "../hostels/hostel.entity";

export type BookingStatus = "PENDING" | "PAID" | "CANCELLED";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { eager: true})
  student!: User;

  @ManyToOne(() => Hostel, { eager: true })
  hostel!: Hostel;

  
  @Column("int")
  price!: number;

 @Column({ type: "varchar", default: "PENDING" })
  status!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
