import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Booking } from "../bookings/booking.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Booking, (booking) => booking.payments)
  booking!: Booking;

  @Column({ nullable: true })
  checkoutRequestId!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column("int")
  amount!: number;

  @Column({
    type: "enum",
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  })
  status!: "PENDING" | "SUCCESS" | "FAILED";

  @Column({ nullable: true })
  mpesaReceiptNumber?: string;

  @CreateDateColumn()
  createdAt!: Date;
  receiptNumber: any;
}
