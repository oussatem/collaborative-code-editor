import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Document } from "./document.interface";

@Injectable()
export class DocumentsService {
  private readonly documents = new Map<string, Document>();

  create(): Document {
    const roomId = randomUUID();
    const now = new Date();

    const document: Document = {
      roomId,
      content: "// Start coding here...",
      language: "javascript",
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(roomId, document);

    return document;
  }

  findByRoomId(roomId: string): Document | undefined {
    return this.documents.get(roomId);
  }
}
