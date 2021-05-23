import { Test, TestingModule } from '@nestjs/testing';
import { StatusSubscriberService } from './status-subscriber.service';

describe('If StatusSubscriberService works', () => {
  let service: StatusSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusSubscriberService],
    }).compile();

    service = module.get<StatusSubscriberService>(StatusSubscriberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
