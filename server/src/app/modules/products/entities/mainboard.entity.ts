import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { MainboardFormFactor } from '../enums/mainboard-type.enum';
import { SocketType } from '../enums/socket-type.enum';
import { RamType } from '../enums/ram-type.enum';
import { ChipsetType } from '../enums/chipset-type.enum';
import { PcieType } from '../enums/pcie-type.enum';

@Entity('mainboard')
export class Mainboard {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column()
  form_factor: MainboardFormFactor;

  @Column()
  socket_type: SocketType;

  @Column({
    type: 'enum',
    enum: ChipsetType,
  })
  chipset: ChipsetType;

  @Column({
    type: 'enum',
    enum: RamType,
  })
  ram_type: RamType;

  @Column({
    nullable: true,
  })
  ram_speed: number;

  @Column()
  ram_slots: number;

  @Column()
  max_ram_capacity: number;

  @Column()
  pcie_slots: number;

  @Column({
    type: 'enum',
    enum: PcieType,
  })
  pcie_version: PcieType;

  @Column()
  m2_slots: number;

  @Column()
  sata_slots: number;

  @Column()
  usb_ports: number;

  @Column()
  rgb: boolean;

  @Column()
  size: string;

  @Column({ default: false })
  has_video_ports: boolean;
}
