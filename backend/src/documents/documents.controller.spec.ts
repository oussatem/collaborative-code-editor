jest.mock("@nestjs/typeorm", () => ({
  InjectRepository: () => () => undefined,
}));

import { NotFoundException } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";

describe("DocumentsController", () => {
  let controller: DocumentsController;

  const mockDocumentsService = {
    create: jest.fn(),
    findByRoomId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new DocumentsController(
      mockDocumentsService as unknown as DocumentsService,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a document", async () => {
    const document = {
      roomId: "room-123",
      content: "// Start coding here...",
      language: "javascript",
    };

    mockDocumentsService.create.mockResolvedValue(document);

    const result = await controller.create();

    expect(mockDocumentsService.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(document);
  });

  it("should return a document by room ID", async () => {
    const document = {
      roomId: "room-123",
      content: 'console.log("hello");',
      language: "javascript",
    };

    mockDocumentsService.findByRoomId.mockResolvedValue(document);

    const result = await controller.findOne("room-123");

    expect(mockDocumentsService.findByRoomId).toHaveBeenCalledWith("room-123");

    expect(result).toEqual(document);
  });

  it("should throw NotFoundException when document does not exist", async () => {
    mockDocumentsService.findByRoomId.mockResolvedValue(null);

    await expect(controller.findOne("missing-room")).rejects.toThrow(
      NotFoundException,
    );

    expect(mockDocumentsService.findByRoomId).toHaveBeenCalledWith(
      "missing-room",
    );
  });
});
