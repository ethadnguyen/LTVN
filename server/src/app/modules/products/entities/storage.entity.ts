import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './products.entity';
import { StorageType } from '../enums/storage-type.enum';

@Entity('storage')
export class Storage {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'id' })
  product: Product;

  @Column({
    type: 'enum',
    enum: StorageType,
  })
  storage_type: StorageType;

  @Column()
  capacity: number;

  @Column()
  read_speed: number;

  @Column()
  write_speed: number;

  @Column()
  form_factor: string;

  @Column()
  cache: number;
}
