import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { ModuleType } from '../enums/module-type.enum';
import { ChannelType } from '../enums/channel-type.enum';
import { RamType } from '../enums/ram-type.enum';

@Entity('ram')
export class RAM {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column({
    type: 'enum',
    enum: RamType,
  })
  ram_type: RamType;

  @Column()
  speed: number;

  @Column()
  capacity: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  latency: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  voltage: number;

  @Column({
    type: 'enum',
    enum: ModuleType,
  })
  module_type: ModuleType;

  @Column({ default: false })
  ecc_support: boolean;

  @Column({ default: 'Single' })
  channel: ChannelType;

  @Column({ nullable: true })
  timing: string;

  @Column({ default: false })
  rgb: boolean;

  @Column({ default: false })
  heat_spreader: boolean;
}
