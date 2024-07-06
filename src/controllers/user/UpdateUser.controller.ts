import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import sha256 from "sha256";
import { z } from "zod";
import { prisma } from "../../config/database";

const userSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("E-Mail inválido").optional(),
  password: z
    .string()
    .transform((arg: string) => sha256.x2(arg))
    .catch("Senha inválida")
    .optional(),
  isSubscribed: z.boolean().optional(),
});

const paramsSchema = z.object({
  id: z.string().uuid("Usuário inválido"),
});

type User = z.infer<typeof userSchema>;
type ParamsType = z.infer<typeof paramsSchema>;

export class UpdateUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const id: string = (paramsSchema.parse(req.params) as ParamsType).id;
      const userData: User = userSchema.parse(req.body);

      const userUpdated = await prisma.user.update({
        where: { id },
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          isSubscribed: true,
          createdAt: true,
        },
      });

      return reply.status(200).send(userUpdated);
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
