import { Test, TestingModule } from '@nestjs/testing';
import { ServerConfigController } from './server_config.controller';
import { ServerConfigService } from './server_config.service';

describe('ServerConfigController', () => {
  let controller: ServerConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerConfigController],
      providers: [ServerConfigService],
    }).compile();

    controller = module.get<ServerConfigController>(ServerConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
