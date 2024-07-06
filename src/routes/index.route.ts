import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { CollaboratorRouter } from "./collaborator.route";
import { UserRouter } from "./user.route";
import { PostRouter } from "./post.route";
import { AuthRoute } from "./auth.route";

export const routerModule = (
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) => {
  fastify.register(new UserRouter().route, {
    prefix: "/user",
  });
  fastify.register(new CollaboratorRouter().route, {
    prefix: "/collaborator",
  });
  fastify.register(new PostRouter().route, {
    prefix: "/post",
  });
  fastify.register(new AuthRoute().route, {
    prefix: "/auth",
  });
  done();
};
