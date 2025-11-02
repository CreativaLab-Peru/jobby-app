import { LogAction, LogLevel, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface CreateLogEntryParams {
  userId?: string;
  action: LogAction;
  entity?: string;
  entityId?: string;
  level?: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  email?: string;
}

export interface QueryLogParams {
  userId?: string;
  action?: LogAction;
  entity?: string;
  entityId?: string;
  level?: LogLevel;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class LogsService {
  async createLog(params: CreateLogEntryParams) {
    return prisma.logEntry.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        level: params.level || LogLevel.INFO,
        message: params.message,
        metadata: params.metadata as Prisma.JsonObject,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }

  async queryLogs(params: QueryLogParams) {
    const where: Prisma.LogEntryWhereInput = {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      level: params.level,
      createdAt: {
        gte: params.startDate,
        lte: params.endDate,
      },
    };

    // Remove undefined values
    Object.keys(where).forEach(
      (key) => where[key] === undefined && delete where[key]
    );

    return prisma.logEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: params.limit || 50,
      skip: params.offset || 0,
      include: {
        user: true,
      },
    });
  }

  async getLogById(id: string) {
    return prisma.logEntry.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}

export const logsService = new LogsService();