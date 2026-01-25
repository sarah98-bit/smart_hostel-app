import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Hostel } from "./hostel.entity";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  roomNumber!: string;

  @Column()
  price!: number;

  @Column({ default: true })
  available!: boolean;

  // ✅ Point to the proper rooms property
  @ManyToOne(() => Hostel, (hostel) => hostel.rooms)
  hostel!: Hostel;
}
