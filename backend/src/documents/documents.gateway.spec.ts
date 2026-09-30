import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsGateway } from './documents.gateway';

describe('DocumentsGateway', () => {
  let gateway: DocumentsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsGateway],
    }).compile();

    gateway = module.get<DocumentsGateway>(DocumentsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
