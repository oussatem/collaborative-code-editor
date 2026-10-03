jest.mock("@nestjs/typeorm", () => ({
  InjectRepository: () => () => undefined,
}));

import { DocumentsService } from "./documents.service";

describe("DocumentsService", () => {
  let service: DocumentsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new DocumentsService(mockRepository as any);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create and save a new document", async () => {
    const createdDocument = {
      roomId: "test-room-id",
      content: "// Start coding here...",
      language: "javascript",
    };

    mockRepository.create.mockReturnValue(createdDocument);
    mockRepository.save.mockResolvedValue(createdDocument);

    const result = await service.create();

    expect(mockRepository.create).toHaveBeenCalledWith({
      roomId: expect.any(String),
      content: "// Start coding here...",
      language: "javascript",
    });

    expect(mockRepository.save).toHaveBeenCalledWith(createdDocument);
    expect(result).toEqual(createdDocument);
  });

  it("should find a document by room ID", async () => {
    const document = {
      roomId: "room-123",
      content: 'console.log("hello");',
      language: "javascript",
    };

    mockRepository.findOne.mockResolvedValue(document);

    const result = await service.findByRoomId("room-123");

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { roomId: "room-123" },
    });

    expect(result).toEqual(document);
  });

  it("should update document content", async () => {
    mockRepository.update.mockResolvedValue({ affected: 1 });

    await service.updateContent("room-123", 'console.log("updated");');

    expect(mockRepository.update).toHaveBeenCalledWith(
      { roomId: "room-123" },
      { content: 'console.log("updated");' },
    );
  });
});
