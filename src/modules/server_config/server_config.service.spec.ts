import { Test, TestingModule } from '@nestjs/testing';
import { ServerConfigService } from './server_config.service';

describe('ServerConfigService', () => {
  let service: ServerConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerConfigService],
    }).compile();

    service = module.get<ServerConfigService>(ServerConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
