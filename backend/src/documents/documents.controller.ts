import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create() {
    return this.documentsService.create();
  }

  @Get(":roomId")
  findOne(@Param("roomId") roomId: string) {
    const document = this.documentsService.findByRoomId(roomId);

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    return document;
  }
}
