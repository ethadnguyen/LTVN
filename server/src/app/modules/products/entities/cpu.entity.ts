import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { SocketType } from '../enums/socket-type.enum';
import { ChipsetType } from '../enums/chipset-type.enum';
import { RamType } from '../enums/ram-type.enum';
import { PcieType } from '../enums/pcie-type.enum';

@Entity('cpu')
export class CPU {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column({
    type: 'enum',
    enum: SocketType,
  })
  socket_type: SocketType;

  @Column({
    type: 'simple-array',
    enum: ChipsetType,
  })
  supported_chipsets: ChipsetType[];

  @Column('simple-json')
  supported_ram: {
    ram_type: RamType;
    max_speed: number;
  }[];

  @Column({ nullable: true })
  cores: number;

  @Column({ nullable: true })
  threads: number;

  @Column()
  base_clock: string;

  @Column()
  boost_clock: string;

  @Column()
  wattage: number;

  @Column()
  tdp: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  cache: string;

  @Column({})
  pcie_version: PcieType;

  @Column()
  pcie_slots: number;

  @Column()
  max_memory_capacity: number;

  @Column()
  has_integrated_gpu: boolean;
}
