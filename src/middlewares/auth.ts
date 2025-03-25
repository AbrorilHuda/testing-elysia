import {Elysia} from "elysia"
import jwt from "@elysiajs/jwt"
import User from "../databases/models/User";

export const authMiddleware = (app: Elysia) => {
    return app.use(
        jwt({
            name: 'jwt',
            secret: Bun.env.SECRET_JWT!
        })
    ).derive(async ({jwt, set, headers}) => {
        const bearer = headers.authorization?.split(' ')[1];
        if(!bearer){
            set.status = 401

            return {
                authorized: false
            }
        }

        const jwtPayloat = await jwt.verify(bearer)

        if(!jwtPayloat){
            set.status = 401

            return {
                authorized: false
            }
        }

        const id = jwtPayloat.id
        const user = User.FindById(id)

        if(!user){
            set.status = 401


            return {
                authorized: false
            }
        }

        return {
            authorized: true
        }
    })
}