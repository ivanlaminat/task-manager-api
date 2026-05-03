import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectEntity } from '../projects/projects.entity';
import { TaskEntity } from '../tasks/tasks.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName!: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName!: string;

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.owner)
  projects!: ProjectEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.assignee)
  tasks!: TaskEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
