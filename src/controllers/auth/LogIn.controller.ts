import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import sha256 from "sha256";
import { z } from "zod";
import { prisma } from "../../config/database";

const SECRET = process.env.SECRET_JWT;

const loginSchema = z.object({
  email: z.string().email("E-Mail inválido"),
  password: z
    .string()
    .transform((p) => sha256.x2(p))
    .catch("Senha inválida"),
});

type Login = z.infer<typeof loginSchema>;

export class LogInController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password }: Login = loginSchema.parse(req.body);

      const userFetched = await prisma.collaborator.findFirst({
        where: {
          email,
          password,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      if (!userFetched) {
        throw new Error("Colaborador não cadastrado.");
      }

      if (SECRET === undefined) {
        throw "Variável de ambiente não carregada";
      }

      const token = jwt.sign(userFetched, SECRET, { expiresIn: "30m" });

      return reply.status(200).send({ token });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: err.message });
      } else {
        console.log(err);
        return reply.status(400).send({ error: "Erro interno no servidor" });
      }
    }
  }
}
