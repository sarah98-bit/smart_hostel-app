import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Booking } from "../bookings/booking.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Booking)
  booking!: Booking;

  @Column("int")
  amount!: number;

  @Column({ default: "MPESA" })
  method!: string;

  @CreateDateColumn()
  paidAt!: Date;
}
