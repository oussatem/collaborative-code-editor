import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DocumentsService } from "./documents.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
  },
})
export class DocumentsGateway implements OnGatewayDisconnect {
  constructor(private readonly documentsService: DocumentsService) {}

  @WebSocketServer()
  server: Server;

  private readonly clientRooms = new Map<string, string>();

  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomId);

    this.clientRooms.set(client.id, roomId);

    const sockets = await this.server.in(roomId).fetchSockets();
    const userCount = sockets.length;

    this.server.to(roomId).emit("user-count", userCount);

    console.log(
      `Client ${client.id} joined room ${roomId}. Users: ${userCount}`,
    );
  }

  async handleDisconnect(client: Socket) {
    const roomId = this.clientRooms.get(client.id);

    if (!roomId) {
      return;
    }

    this.clientRooms.delete(client.id);

    const sockets = await this.server.in(roomId).fetchSockets();
    const userCount = sockets.length;

    this.server.to(roomId).emit("user-count", userCount);

    console.log(`Client ${client.id} left room ${roomId}. Users: ${userCount}`);
  }

  @SubscribeMessage("code-change")
  async handleCodeChange(
    @MessageBody() data: { roomId: string; code: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.documentsService.updateContent(data.roomId, data.code);

    client.to(data.roomId).emit("code-update", data.code);
  }
}
