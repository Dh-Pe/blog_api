import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { CreateUserController } from "../controllers/user/CreateUser.controller";
import { DeleteUserController } from "../controllers/user/DeleteUser.controller";
import { GetUserController } from "../controllers/user/GetUser.controller";
import { GetUsersController } from "../controllers/user/GetUsers.controller";
import { UpdateUserController } from "../controllers/user/UpdateUser.controller";

export class UserRouter {
  route(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ) {
    fastify.get("/", new GetUsersController().handle);
    fastify.post("/", new CreateUserController().handle);
    fastify.get("/:id", new GetUserController().handle);
    fastify.put("/:id", new UpdateUserController().handle);
    fastify.delete("/:id", new DeleteUserController().handle);
    done();
  }
}
