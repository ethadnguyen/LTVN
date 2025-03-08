import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permission', { schema: 'public' })
export class Permission {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;
}
