
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TaskDto } from './dto/task.dto';

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Get()
  @Auth()
  async getAll(@CurrentUser("id") userId: string) {
    return this.taskService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  @HttpCode(200)
  async create(@Body() dto: TaskDto, @CurrentUser("id") userId: string) {
    return this.taskService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @Put(":id")
  @Auth()
  @HttpCode(200)
  async update(
    @Body() dto: TaskDto,
    @CurrentUser("id") userId: string,
    @Param("id") id: string
  ) {
    return this.taskService.update(dto, id, userId)
  }

  @Delete(":id")
  @Auth()
  @HttpCode(200)
  async delete(@Param("id") id: string) {
    return this.taskService.delete(id)
  }
}
