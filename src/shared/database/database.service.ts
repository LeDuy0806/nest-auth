import { Logger, OnModuleInit } from '@nestjs/common'

export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name)

  constructor() {}

  async onModuleInit() {
    this.logger.log('Database service initialized')
  }
}
