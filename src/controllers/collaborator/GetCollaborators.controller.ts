import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/database";

export class GetCollaboratorsController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const collaboratorCreated = await prisma.collaborator.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          posts: true,
        },
      });

      return reply.status(200).send(collaboratorCreated);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: err.message });
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return reply.status(400).send({ error: "Erro ao consultar usuários" });
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
