import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";
import { Document } from "./document.entity";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async create(): Promise<Document> {
    const document = this.documentsRepository.create({
      roomId: randomUUID(),
      content: "// Start coding here...",
      language: "javascript",
    });

    return this.documentsRepository.save(document);
  }

  async findByRoomId(roomId: string): Promise<Document | null> {
    return this.documentsRepository.findOne({
      where: { roomId },
    });
  }
}
