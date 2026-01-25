import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Room } from "./room.entity";

@Entity("hostels")
export class Hostel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("int")
  price_kes_per_month!: number;

  @Column("float")
  distance_km!: number;

  @Column("float")
  rating!: number;

  @Column("text")
  facilities!: string;

  @Column("text")
  room_types!: string;

  // ✅ Add this line to define the rooms relationship
  @OneToMany(() => Room, (room) => room.hostel)
  rooms!: Room[];
}
