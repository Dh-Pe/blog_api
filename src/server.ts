import fastify from "fastify";
import { routerModule } from "./routes/index.route";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = fastify();

app.register(routerModule, {
  prefix: "/",
});

app.listen({ port: port }, (err, address) => {
  if (err) process.exit(0);
  console.log(`Server is listenning on address: ${address}`);
});
