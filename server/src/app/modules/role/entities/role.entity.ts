import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('role', { schema: 'public' })
export class Role {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_name',
      referencedColumnName: 'name',
    },
    inverseJoinColumn: {
      name: 'permission_name',
      referencedColumnName: 'name',
    },
  })
  permissions: Permission[];
}
