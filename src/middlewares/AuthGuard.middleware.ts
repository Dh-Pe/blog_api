import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import z from "zod";

const SECRET = process.env.SECRET_JWT;

const authSchema = z
  .string()
  .refine(
    (val) => {
      if (!val.startsWith("Bearer ")) {
        return false;
      }
      const token = val.split(" ")[1];
      const parts = token.split(".");
      return parts.length === 3;
    },
    {
      message: "Credencial inválida",
    }
  )
  .transform((val) => {
    return val.replace("Bearer ", "");
  });

const userSchema = z.object({
  id: z.string().uuid("Usuário inválido"),
  name: z.string(),
  email: z.string().email("E-Mail inválido"),
  isSubscribed: z.boolean(),
  createdAt: z.date({ coerce: true }),
});

type User = z.infer<typeof userSchema>;

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}

export class AuthGuardMiddleware {
  handle(req: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
    try {
      const token: string = authSchema.parse(req.headers.authorization);

      if (SECRET === undefined) {
        throw "Variável de ambiente não carregada";
      }

      const user: User = userSchema.parse(jwt.verify(token, SECRET));

      req.user = user;

      return done();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: err.errors[0].message });
      } else if (err instanceof Error) {
        return reply.status(400).send({ error: "Token inválido" });
      } else {
        return reply.status(500).send({ error: "Erro interno do servidor" });
      }
    }
  }
}
