import {Elysia} from "elysia"
import {jwt} from "@elysiajs/jwt"

export const authMiddleware = (app: Elysia) => {
    return app.use(
        jwt({

        })
    )
}