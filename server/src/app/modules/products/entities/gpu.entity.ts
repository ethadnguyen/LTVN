import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { DisplayPortsType } from '../enums/displayport-type.enum';
import { PowerConnectorType } from '../enums/power-connector-type.enum';
import { MemoryType } from '../enums/memory-type.enum';
import { PcieType } from '../enums/pcie-type.enum';

@Entity()
export class GPU {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column({
    type: 'varchar',
    length: 255,
  })
  chipset: string;

  @Column()
  memory_size: number;

  @Column({
    type: 'enum',
    enum: MemoryType,
    nullable: true,
  })
  memory_type: MemoryType;

  @Column()
  min_psu_wattage: number;

  @Column({
    type: 'enum',
    enum: PowerConnectorType,
    nullable: true,
  })
  power_connector: PowerConnectorType;

  @Column()
  core_clock: string;

  @Column()
  boost_clock: string;

  @Column()
  tdp: number;

  @Column({
    type: 'enum',
    enum: PcieType,
  })
  pcie_version: PcieType;

  @Column()
  slot_size: string;

  @Column()
  cuda_cores: number;

  @Column()
  tensor_cores: number;

  @Column({
    type: 'enum',
    enum: DisplayPortsType,
    array: true,
    nullable: true,
  })
  display_ports: DisplayPortsType[];

  @Column()
  length: number;
}
