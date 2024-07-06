import { FastifyReply, FastifyRequest } from "fastify";
import sha256 from "sha256";
import { z } from "zod";
import { prisma } from "../../config/database";

const collaboratorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-Mail inválido"),
  password: z
    .string()
    .transform((arg: string) => sha256.x2(arg))
    .catch("Senha inválida"),
});

type Collaborator = z.infer<typeof collaboratorSchema>;

export class CreateCollaboratorController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const collaboratorData: Collaborator = collaboratorSchema.parse(req.body);

      const collaboratorCreated = await prisma.collaborator.create({
        data: collaboratorData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          posts: true,
        },
      });

      return reply.status(201).send(collaboratorCreated);
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
