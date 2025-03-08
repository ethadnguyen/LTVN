import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { MainboardFormFactor } from '../enums/mainboard-type.enum';

@Entity('case')
export class Case {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column()
  length: number;

  @Column({
    nullable: true,
  })
  width: number;

  @Column({
    nullable: true,
  })
  height: number;

  @Column()
  color: string;

  @Column()
  material: string;

  @Column()
  psu_max_length: number;

  @Column()
  cpu_cooler_height: number;

  @Column()
  max_gpu_length: number;

  @Column({
    type: 'simple-array',
    enum: MainboardFormFactor,
  })
  form_factor: MainboardFormFactor[];
}
