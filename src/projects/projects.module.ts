import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [ProjectsService],
  exports: [ProjectsService], // Экспортируем, чтобы другие модули могли использовать
})
export class ProjectsModule {}
