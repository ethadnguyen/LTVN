import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('categories')
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({ nullable: true })
  slug: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @Column({ default: 0 })
  products_count: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_sale: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
