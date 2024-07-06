import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/database";

const paramsSchema = z.object({
  id: z.bigint().nonnegative("Post inexistente"),
});

type ParamsType = z.infer<typeof paramsSchema>;

export class DeletePostController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const id: number = Number(
        (paramsSchema.parse(req.params) as ParamsType).id
      );

      const postDeleted = await prisma.post.delete({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          collaborator: true,
          reactions: true,
        },
      });

      return reply.status(200).send(postDeleted);
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
