import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/database";

const paramsSchema = z.object({
  id: z.string().uuid("Usuário inválido"),
});

type ParamsType = z.infer<typeof paramsSchema>;

export class DeleteUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const id: string = (paramsSchema.parse(req.params) as ParamsType).id;

      const userDeleted = await prisma.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          isSubscribed: true,
          createdAt: true,
        },
      });

      return reply.status(200).send(userDeleted);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: err.message });
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
