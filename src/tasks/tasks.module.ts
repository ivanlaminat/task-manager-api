import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskEntity } from './tasks.entity';
import { ProjectEntity } from '../projects/projects.entity';
import { UserEntity } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, ProjectEntity, UserEntity])],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
