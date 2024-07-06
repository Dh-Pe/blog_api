import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { CreateCollaboratorController } from "../controllers/collaborator/CreateCollaborator.controller";
import { DeleteCollaboratorController } from "../controllers/collaborator/DeleteCollaborator.controller";
import { GetCollaboratorController } from "../controllers/collaborator/GetCollaborator.controller";
import { GetCollaboratorsController } from "../controllers/collaborator/GetCollaborators.controller";
import { UpdateCollaboratorController } from "../controllers/collaborator/UpdateCollaborator.controller";
import { AuthGuardMiddleware } from "../middlewares/AuthGuard.middleware";

export class CollaboratorRouter {
  route(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
  ): void {
    fastify.get("/", new GetCollaboratorsController().handle);
    fastify.post("/", new CreateCollaboratorController().handle);
    fastify.get("/:id", new GetCollaboratorController().handle);
    fastify.put("/:id", new UpdateCollaboratorController().handle);
    fastify.delete("/:id", new DeleteCollaboratorController().handle);
    done();
  }
}
