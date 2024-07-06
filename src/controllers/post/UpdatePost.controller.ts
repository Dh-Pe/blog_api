import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/database";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  slug: z.string(),
});

const paramsSchema = z.object({
  id: z.bigint().nonnegative("Post inexistente"),
});

type Post = z.infer<typeof postSchema>;
type ParamsType = z.infer<typeof paramsSchema>;

export class UpdatePostController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const id: number = Number(
        (paramsSchema.parse(req.params) as ParamsType).id
      );
      const postData: Post = postSchema.parse(req.body);

      const postUpdated = await prisma.post.update({
        where: { id },
        data: postData,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          collaborator: true,
          reactions: true,
        },
      });

      return reply
        .status(200)
        .send({ ...postUpdated, id: Number(postUpdated.id) });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].path });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: err.message });
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002" && err.meta && err.meta.target) {
          return reply.status(400).send({ error: "E-Mail já existente" });
        } else {
          return reply.status(400).send({ error: "Erro ao editar usuário" });
        }
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
