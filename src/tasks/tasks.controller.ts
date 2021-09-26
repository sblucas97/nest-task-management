import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTAsksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { Task } from "./task.entity";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  private tasksService: TasksService;

  constructor(tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getTasks(@Query() filterDto: GetTAsksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get("/:id")
  getTaskById(@Param("id") id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete("/:id")
  deleteTask(@Param("id") id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @Body() udpateTaskStatusDto: UpdateTaskStatusDto
  ): Promise<Task> {
    const { status } = udpateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
