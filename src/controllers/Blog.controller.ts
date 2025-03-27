import { Elysia, t } from "elysia";
import Blog from "../databases/models/Blog";
import Category from "../databases/models/Category";
import { authMiddleware } from "../middlewares/auth";

interface RequestBody {
  categoryId: string | number;
  title: string;
  content: string;
  imageUrl: string;
}

class BlogController {
  public init() {
    return new Elysia({ prefix: "/api" }).group("/blogs", (app) =>
      app
        .get(
          "/",
          () => {
            const blogs = Blog.GetAll();

            return {
              success: true,
              message: "Successfully retrieved blogs.",
              data: blogs,
            };
          },
          // rafactor code
        )
        .get(
          "/category/:id",
          ({ params }) => {
            const category = Category.FindById(Number(params.id));

            if (!category) {
              return {
                success: false,
                message: "Category not found.",
              };
            }

            const blogs = Blog.FindByCategoryId(Number(params.id));

            return {
              success: true,
              message: "Successfully retrieved blogs.",
              data: blogs,
            };
          },
          // refactor code
        )
        .get(
          "/:id",
          ({ params }) => {
            const blog = Blog.FindById(Number(params.id));

            return {
              success: true,
              message: "Successfully retrieved blog.",
              data: blog,
            };
          },
          // refactor code
        )
        .guard((application) =>
          application
            // middleware untuk cek apakah user terautentikasi
            // atau tidak
            .use(authMiddleware)
            .onBeforeHandle(({ authorized }) => {
              if (!authorized) {
                return {
                  success: false,
                  message: "Forbidden.",
                };
              }
            })
            .post(
              "/create",
              async ({
                jwt,
                body,
                headers,
              }: {
                jwt: any;
                body: RequestBody;
                headers: any;
              }) => {
                const category = Category.FindById(
                  Number((body as RequestBody).categoryId),
                ) as CategoryType;

                if (!category) {
                  return {
                    success: false,
                    message: "Category not found.",
                  };
                }

                const bearer = headers.authorization?.split(" ")[1];
                const jwtPayload = await jwt.verify(bearer);

                if (!jwtPayload) {
                  return {
                    success: false,
                    message: "Unauthorized.",
                  };
                }

                const id = jwtPayload.id;

                Blog.UpdateOrCreate(
                  category.id,
                  body.title,
                  body.imageUrl,
                  body.content,
                  id as number,
                  undefined,
                );

                return {
                  success: true,
                  message: "Blog created successfully.",
                };
              },
              // refactor code
            )
            .put(
              "/update/:id",
              async ({
                jwt,
                body,
                params,
                set,
                headers,
              }: {
                jwt: any;
                body: RequestBody;
                params: any;
                set: any;
                headers: any;
              }) => {
                const bearer = headers.authorization?.split(" ")[1];
                const jwtPayload = await jwt.verify(bearer);

                if (!jwtPayload) {
                  set.status = 401;

                  return {
                    success: false,
                    message: "Unauthorized.",
                  };
                }

                const id = jwtPayload.id;
                const findBlog = Blog.FindById(
                  Number(params.id) as number,
                ) as BlogType;

                if (!findBlog) {
                  set.status = 404;

                  return {
                    success: false,
                    message: "Blog not found.",
                  };
                }

                if (findBlog.userId !== id) {
                  set.status = 403;

                  return {
                    success: false,
                    message: "Forbidden.",
                  };
                }

                Blog.UpdateOrCreate(
                  findBlog.categoryId,
                  body.title,
                  body.imageUrl,
                  body.content,
                  id as number,
                  Number(params.id),
                );

                return {
                  success: true,
                  message: "Blog updated successfully.",
                };
              },
              //refactor code
            )
            .delete(
              "/delete/:id",
              async ({ jwt, params, set, headers }) => {
                const bearer = headers.authorization?.split(" ")[1];
                const jwtPayload = await jwt.verify(bearer);

                if (!jwtPayload) {
                  set.status = 401;

                  return {
                    success: false,
                    message: "Unauthorized.",
                  };
                }

                const id = jwtPayload.id;
                const findBlog = Blog.FindById(
                  Number(params.id) as number,
                ) as BlogType;

                if (!findBlog) {
                  set.status = 404;

                  return {
                    success: false,
                    message: "Blog not found.",
                  };
                }

                if (findBlog.userId !== id) {
                  set.status = 403;

                  return {
                    success: false,
                    message: "Forbidden.",
                  };
                }

                Blog.Delete(Number(params.id));

                return {
                  success: true,
                  message: "Blog deleted successfully.",
                };
              },
              // refactor code
            ),
        ),
    );
  }
}

export default new BlogController().init();
