import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../config/database";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  slug: z.string(),
});

type Post = z.infer<typeof postSchema>;

export class CreatePostController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const postData: Post = postSchema.parse(req.body);

      const postCreated = await prisma.post.create({
        data: { ...postData, collaboratorId: "" }, //TODO: TROCAR COLLABORATOR_ID POR USUÁRIO DO TOKEN
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
        .status(201)
        .send({ ...postCreated, id: Number(postCreated.id) });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        console.log(err);
        return reply.status(400).send({ error: "E-Mail já existente" });
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
