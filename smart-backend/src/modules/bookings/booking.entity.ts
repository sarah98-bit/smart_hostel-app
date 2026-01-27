import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
} from "typeorm";
import { User } from "../../entities/user.entity";
import { Hostel } from "../hostels/hostel.entity";
import { Payment } from "../payments/payment.entity";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @ManyToOne(() => Hostel, { eager: true })
  hostel!: Hostel;

  @Column("int")
  price!: number;

  @Column({ type: "varchar", default: "PENDING" })
  status!: BookingStatus;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;
}
