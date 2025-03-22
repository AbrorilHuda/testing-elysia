import { Elysia } from "elysia";
import { myDocumentation } from "./lib/doc/swagger";

type dataType = {
  name: string
  age: number
}

class Note {
  constructor(public data: dataType[] = [{
    name: "anjas",
    age: 45
  }]){}
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
    .ws('/ping', {
      message(ws, message) {
          ws.send('hello ' + message)
      }
  })
.listen(Bun.env.PORT!);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);