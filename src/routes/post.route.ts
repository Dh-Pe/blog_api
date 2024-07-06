import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { CreatePostController } from "../controllers/post/CreatePost.controller";
import { DeletePostController } from "../controllers/post/DeletePost.controller";
import { GetPostController } from "../controllers/post/GetPost.controller";
import { GetPostsController } from "../controllers/post/GetPosts.controller";
import { UpdatePostController } from "../controllers/post/UpdatePost.controller";

export class PostRouter {
  route(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ) {
    fastify.get("/", new GetPostsController().handle);
    fastify.post("/", new CreatePostController().handle);
    fastify.get("/:id", new GetPostController().handle);
    fastify.put("/:id", new UpdatePostController().handle);
    fastify.delete("/:id", new DeletePostController().handle);
    done();
  }
}
