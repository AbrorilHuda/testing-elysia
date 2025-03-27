import { Elysia } from "elysia";
import { setupDatabase, resetTables } from "./databases/db";
import { cors } from "@elysiajs/cors";
import AuthController from "./controllers/Auth.controller";
import UserController from "./controllers/User.controller";
import BlogController from "./controllers/Blog.controller";
import CategoryController from "./controllers/Category.controller";
import { swaggerConfig } from "./lib/config/swagger.config";

// memanggil fungsi untuk inisialisasi database saat
// pertama kali run dan reset data
console.log("🗑️  Reset Database.....");
resetTables();
console.log("✅ Done Reset!");
console.log("🚀 Initializing Database...");
setupDatabase();
console.log("✅ Done!");

const app = new Elysia()
  .use(cors())
  .use(swaggerConfig)
  .use(AuthController)
  .use(CategoryController)
  .use(UserController)
  .use(BlogController)
  .listen(Bun.env.PORT!);

console.log("Running application......");
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
