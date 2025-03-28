import Elysia from "elysia";
import type { ElysiaSwaggerConfig } from "@elysiajs/swagger";
import { blogSchema } from "./blogDoc";

function getPathsFromApp(app: Elysia): ElysiaSwaggerConfig {
  // @ts-ignore - Mengakses properti internal untuk mendapatkan schema
  const schema = app.schema;
  return schema?.paths || {};
}
export const swaggerPaths: ElysiaSwaggerConfig = {
  ...getPathsFromApp(blogSchema.paths),
};

// experimental fiks type to paths swagger
