// index.js
import { Application, Router } from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { bookRouter } from "./routes/api/books.js";
import { CORS } from "https://deno.land/x/oak_cors@v0.1.0/mod.ts";

const app = new Application();
app.use(CORS());

const router = new Router().use(
  "/api/books",
  bookRouter.routes(),
  bookRouter.allowedMethods(),
);

const port = Deno.env.get("PORT") || 8082;

console.log(`Server running on port ${port}`);
await app.use(router.routes()).listen({ port: Number(port) });
