import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { CreatePostController } from "../controllers/post/CreatePost.controller";
import { DeletePostController } from "../controllers/post/DeletePost.controller";
import { GetPostController } from "../controllers/post/GetPost.controller";
import { GetPostsController } from "../controllers/post/GetPosts.controller";
import { UpdatePostController } from "../controllers/post/UpdatePost.controller";
import { AuthGuardMiddleware } from "../middlewares/AuthGuard.middleware";

export class PostRouter {
  route(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ) {
    fastify.get("/", new GetPostsController().handle);
    fastify.post(
      "/",
      {
        preHandler: new AuthGuardMiddleware().handle,
      },
      new CreatePostController().handle
    );
    fastify.get("/:id", new GetPostController().handle);
    fastify.put(
      "/:id",
      {
        preHandler: new AuthGuardMiddleware().handle,
      },
      new UpdatePostController().handle
    );
    fastify.delete(
      "/:id",
      {
        preHandler: new AuthGuardMiddleware().handle,
      },
      new DeletePostController().handle
    );
    done();
  }
}
