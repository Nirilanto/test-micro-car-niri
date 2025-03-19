// auth-service/src/seed/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  async seed() {
    this.logger.log('Seed service called successfully');
    // Ne faites rien d'autre pour l'instant
  }
}