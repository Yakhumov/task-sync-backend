import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { startOfDay, subDays } from "date-fns"

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        tasks: true
      }
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async getProfile(id: string) {
    const profile = await this.getById(id);

    const totalTasks = profile.tasks.length

    // плохой подход, по хорошему нужно создать отдельную сущность и там
    // через task service обращаться к this.prisma.task.count,
    // а тут уже использовать этот сервис
    const completedTasks = await this.prisma.task.count({
      where: {
        userId: id,
        isCompleted: true
      }
    })

    const todayStart = startOfDay(new Date())
    const weekStart = startOfDay(subDays(new Date(), 7))

    // плохой подход, по хорошему нужно создать отдельную сущность и там
    // через task service обращаться к this.prisma.task.count,
    // а тут уже использовать этот сервис
    const todayTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString()
        }
      }
    })

    // плохой подход, по хорошему нужно создать отдельную сущность и там
    // через task service обращаться к this.prisma.task.count,
    // а тут уже использовать этот сервис
    const weekTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString()
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...rest} = profile

    return {
      user: rest,
      statistics: [
        {label: "Total", value: totalTasks},
        {label: "Completed tasks", value: completedTasks},
        {label: "Today tasks", value: todayTasks},
        {label: "Week tasks", value: weekTasks},
      ]
    }
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      name: '',
      password: await hash(dto.password)
    }

    return this.prisma.user.create({
      data: user
    })
  }

  async update(id: string, dto: UserDto) {
    let data = dto

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        name: true,
        email: true
      }
    })
  }

  async getByIdForSelectData(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        intervalsCount: true
      }
    })
  }
}
