import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectEntity } from '../projects/projects.entity';
import { UserEntity } from '../users/users.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    // Инжектим репозитории проектов и юзеров для проверки их существования
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(projectId?: number, status?: string): Promise<TaskEntity[]> {
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.project', 'project');

    if (projectId) {
      qb.andWhere('task.project_id = :projectId', { projectId });
    }
    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignee'],
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    // В реальном приложении здесь проверяем существование project и assignee
    const task = this.taskRepository.create(dto);

    if (dto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: dto.projectId },
      });
      if (!project)
        throw new NotFoundException(`Project #${dto.projectId} not found`);
      task.project = project;
    }

    if (dto.assigneeId) {
      const assignee = await this.userRepository.findOne({
        where: { id: dto.assigneeId },
      });
      if (!assignee)
        throw new NotFoundException(`User #${dto.assigneeId} not found`);
      task.assignee = assignee;
    }

    return this.taskRepository.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const existingTask = await this.findOne(id);

    // Обновляем только те поля, которые пришли
    const updatedTask = this.taskRepository.merge(existingTask, dto);
    return this.taskRepository.save(updatedTask);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
