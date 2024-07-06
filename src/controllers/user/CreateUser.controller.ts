import { FastifyReply, FastifyRequest } from "fastify";
import sha256 from "sha256";
import { z } from "zod";
import { prisma } from "../../config/database";

const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-Mail inválido"),
  password: z
    .string()
    .transform((arg: string) => sha256.x2(arg))
    .catch("Senha inválida"),
  isSubscribed: z.boolean().default(false),
});

type User = z.infer<typeof userSchema>;

export class CreateUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userData: User = userSchema.parse(req.body);

      const userCreated = await prisma.user.create({
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          isSubscribed: true,
          createdAt: true,
        },
      });

      return reply.status(201).send(userCreated);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: "E-Mail já existente" });
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
