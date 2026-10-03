jest.mock("@nestjs/typeorm", () => ({
  InjectRepository: () => () => undefined,
}));

import { DocumentsGateway } from "./documents.gateway";
import { DocumentsService } from "./documents.service";

describe("DocumentsGateway", () => {
  let gateway: DocumentsGateway;

  const mockDocumentsService = {
    updateContent: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    gateway = new DocumentsGateway(
      mockDocumentsService as unknown as DocumentsService,
    );
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  it("should persist and broadcast code changes", async () => {
    const emit = jest.fn();

    const client = {
      to: jest.fn().mockReturnValue({
        emit,
      }),
    };

    mockDocumentsService.updateContent.mockResolvedValue(undefined);

    await gateway.handleCodeChange(
      {
        roomId: "room-123",
        code: 'console.log("updated");',
      },
      client as any,
    );

    expect(mockDocumentsService.updateContent).toHaveBeenCalledWith(
      "room-123",
      'console.log("updated");',
    );

    expect(client.to).toHaveBeenCalledWith("room-123");

    expect(emit).toHaveBeenCalledWith("code-update", 'console.log("updated");');
  });

  it("should join a room and broadcast the user count", async () => {
    const emit = jest.fn();
    const fetchSockets = jest.fn().mockResolvedValue([{}, {}]);

    const server = {
      in: jest.fn().mockReturnValue({
        fetchSockets,
      }),
      to: jest.fn().mockReturnValue({
        emit,
      }),
    };

    const client = {
      id: "client-1",
      join: jest.fn().mockResolvedValue(undefined),
    };

    gateway.server = server as any;

    await gateway.handleJoinRoom("room-123", client as any);

    expect(client.join).toHaveBeenCalledWith("room-123");
    expect(server.in).toHaveBeenCalledWith("room-123");
    expect(fetchSockets).toHaveBeenCalledTimes(1);
    expect(server.to).toHaveBeenCalledWith("room-123");

    expect(emit).toHaveBeenCalledWith("user-count", 2);
  });

  it("should update the user count when a client disconnects", async () => {
    const emit = jest.fn();
    const fetchSockets = jest.fn().mockResolvedValue([{}]);

    const server = {
      in: jest.fn().mockReturnValue({
        fetchSockets,
      }),
      to: jest.fn().mockReturnValue({
        emit,
      }),
    };

    const client = {
      id: "client-1",
      join: jest.fn().mockResolvedValue(undefined),
    };

    gateway.server = server as any;

    await gateway.handleJoinRoom("room-123", client as any);

    jest.clearAllMocks();

    await gateway.handleDisconnect(client as any);

    expect(server.in).toHaveBeenCalledWith("room-123");
    expect(fetchSockets).toHaveBeenCalledTimes(1);
    expect(server.to).toHaveBeenCalledWith("room-123");

    expect(emit).toHaveBeenCalledWith("user-count", 1);
  });

  it("should safely handle disconnecting a client with no room", async () => {
    const server = {
      in: jest.fn(),
      to: jest.fn(),
    };

    gateway.server = server as any;

    const client = {
      id: "unknown-client",
    };

    await gateway.handleDisconnect(client as any);

    expect(server.in).not.toHaveBeenCalled();
    expect(server.to).not.toHaveBeenCalled();
  });
});
