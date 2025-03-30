import { Elysia, t } from "elysia";
import { authMiddleware } from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";
import User from "../databases/models/User";

class UserController {
  public init() {
    return new Elysia({ prefix: "/api" }).group("/users", (app) =>
      app
        .use(authMiddleware)
        .onBeforeHandle(({ authorized }) => {
          if (!authorized) {
            return {
              success: false,
              message: "Forbidden.",
            };
          }
        })
        .get(
          "/get/:id",
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

            if (String(id) !== params.id) {
              set.status = 403;

              return {
                success: false,
                message: "Forbidden.",
              };
            }

            const user = User.FindById(Number(params.id)) as User;

            return {
              success: true,
              message: "Successfully retrieved user.",
              data: user,
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
            body: RequestBodyUsers;
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
            const findUser = User.FindById(id as number) as UserType;

            if (findUser.isAdmin && Number(params.id) !== null) {
              User.UpdateOrCreate(
                body.name,
                body.email,
                body.isAdmin,
                undefined,
                Number(params.id),
              );

              return {
                success: true,
                message: "User updated successfully.",
              };
            } else {
              if (String(id) !== params.id) {
                set.status = 403;

                return {
                  success: false,
                  message: "Forbidden.",
                };
              }

              if (body.password) {
                const password = await Bun.password.hash(body.password, {
                  algorithm: "bcrypt",
                  cost: 10,
                });

                User.UpdateOrCreate(
                  body.name,
                  body.email,
                  false,
                  password,
                  Number(params.id),
                );

                return {
                  success: true,
                  message: "User updated successfully.",
                };
              } else {
                User.UpdateOrCreate(
                  body.name,
                  body.email,
                  false,
                  undefined,
                  Number(params.id),
                );

                return {
                  success: true,
                  message: "User updated successfully.",
                };
              }
            }
          },
          // refactor code
        )
        .guard((app) =>
          app
            .use(isAdmin)
            .onBeforeHandle(({ isAdmin }) => {
              if (!isAdmin) {
                return {
                  success: false,
                  message: "Forbidden.",
                };
              }
            })
            .delete(
              "/deactivate/:id",
              ({ params, set }) => {
                const user = User.FindById(Number(params.id)) as User;

                if (!user) {
                  set.status = 404;

                  return {
                    success: false,
                    message: "User not found.",
                  };
                }

                User.Delete(Number(params.id));

                return {
                  success: true,
                  message: "User deleted successfully.",
                };
              },
              // refactor code
            )
            .get(
              "/",
              () => {
                const users = User.GetAll();

                return {
                  success: true,
                  message: "Successfully retrieved users.",
                  data: users,
                };
              },
              // refactor code
            ),
        ),
    );
  }
}

export default new UserController().init();
