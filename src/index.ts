import { Elysia } from "elysia";
import { myDocumentation } from "./lib/doc/swagger";
class Note {
  constructor(public data: string[] = ["hallo"]){}
}

const app = new Elysia()
      .use(myDocumentation)
      .decorate('note', new Note())
      .get("/", ({path}) => path)
      .get("/note", ({note}) => note.data)
      .group("/auth", app => {
        return app
            .get("/", () => "Hi")
            .post("/sign-in", ({ body }) => body)
            .put("/sign-up", ({ body }) => body)
    })
.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);