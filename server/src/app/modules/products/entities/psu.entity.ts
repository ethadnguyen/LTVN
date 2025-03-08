import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { ATX12VType } from '../enums/atx12-type.enum';
import { ProtectionType } from '../enums/protection-type.enum';
import { PowerConnectorType } from '../enums/power-connector-type.enum';

@Entity('psu')
export class PSU {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column()
  wattage: number;

  @Column()
  efficiency_rating: number;

  @Column()
  form_factor: string;

  @Column()
  modular: boolean;

  @Column()
  input_voltage: number;

  @Column({ nullable: true })
  fan_size: number;

  @Column({ nullable: true })
  fan_speed: number;

  @Column({ nullable: true })
  noise_level: number;

  @Column({ nullable: true })
  fan_bearing: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  rgb: boolean;

  @Column({
    type: 'enum',
    enum: ATX12VType,
    default: ATX12VType.ATX12V_2_4,
  })
  atx12v_version: ATX12VType;

  @Column({
    type: 'enum',
    enum: PowerConnectorType,
    array: true,
    default: [],
  })
  power_connectors: PowerConnectorType[];

  @Column()
  pcie_connectors: number;

  @Column()
  sata_connectors: number;

  @Column()
  eps_connectors: number;

  @Column({
    type: 'enum',
    enum: ProtectionType,
    array: true,
    default: [],
  })
  protection_features: ProtectionType[];
}
