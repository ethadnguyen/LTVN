import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { CoolingType } from '../enums/cooling-type.enum';
import { SocketType } from '../enums/socket-type.enum';
import { Transform } from 'class-transformer';

@Entity('cooling')
export class Cooling {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column()
  cooling_type: CoolingType;

  @Column({
    nullable: true,
  })
  length: number;

  @Column({
    nullable: true,
  })
  width: number;

  @Column({
    nullable: true,
  })
  height: number;

  @Column({
    type: 'simple-array',
    enum: SocketType,
  })
  socket_support: SocketType[];

  @Column()
  fan_speed: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  noise_level: number;

  @Column()
  fan_size: number;
}
