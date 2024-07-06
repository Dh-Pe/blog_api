import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { LogInController } from "../controllers/auth/LogIn.controller";

export class AuthRoute {
  route(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ): void {
    fastify.post("/login", new LogInController().handle);
    done();
  }
}
