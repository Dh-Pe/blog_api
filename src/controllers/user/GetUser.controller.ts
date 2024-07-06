import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/database";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type ParamsType = z.infer<typeof paramsSchema>;

export class GetUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const id: string = (paramsSchema.parse(req.params) as ParamsType).id;

      const userFetched = await prisma.user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isSubscribed: true,
          createdAt: true,
        },
      });

      return reply.status(200).send(userFetched);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: err.message });
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return reply.status(400).send({ error: "Erro ao consultar usuário" });
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
