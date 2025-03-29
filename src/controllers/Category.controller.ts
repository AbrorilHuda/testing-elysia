import { Elysia, t } from "elysia";
import Category from "../databases/models/Category";
import { isAdmin } from "../middlewares/isAdmin";
class CategoryController {
  public init() {
    return new Elysia({ prefix: "/api" }).group("/categories", (app) =>
      app
        .get(
          "/",
          () => {
            const categories = Category.GetAll();

            return {
              success: true,
              message: "Successfully retrieved categories.",
              data: categories,
            };
          },
          // refactor code
        )
        .guard((app) =>
          app
            //implementasi middleware untuk cek admin
            .use(isAdmin)
            .onBeforeHandle(({ isAdmin }) => {
              if (!isAdmin) {
                return {
                  success: false,
                  message: "Forbidden.",
                };
              }
            })
            .post(
              "/create",
              ({ body }: { body: RequestBody }) => {
                Category.UpdateOrCreate(body.title);

                return {
                  success: true,
                  message: "Category created successfully.",
                };
              },
              // refactor code
            )
            .put(
              "/update/:id",
              ({
                body,
                params,
                set,
              }: {
                body: RequestBody;
                params: any;
                set: any;
              }) => {
                const category = Category.FindById(
                  Number(params.id),
                ) as Category;

                if (!category) {
                  set.status = 404;

                  return {
                    success: false,
                    message: "Category not found.",
                  };
                }

                Category.UpdateOrCreate(body.title, Number(params.id));

                return {
                  success: true,
                  message: "Category updated successfully.",
                };
              },
              // refactor code
            )
            .delete(
              "/delete/:id",
              ({ params, set }) => {
                const category = Category.FindById(
                  Number(params.id),
                ) as Category;

                if (!category) {
                  set.status = 404;

                  return {
                    success: false,
                    message: "Category not found.",
                  };
                }

                Category.Delete(Number(params.id));

                return {
                  success: true,
                  message: "Category deleted successfully.",
                };
              },
              // refactor code
            ),
        ),
    );
  }
}

export default new CategoryController().init();
