import {Elysia} from "elysia"
import {jwt} from "@elysiajs/jwt"
import User from "../databases/models/User"


export const isAdmin = (app: Elysia) => {
   return app.use(
    jwt({
        name: 'jwt',
        secret: Bun.env.SECRET_JWT!
    })
   ).derive(async ({jwt,set,headers}) => {
        const bearer = headers.authorization?.split(' ')[1]

        if(!bearer){
            set.status = 401
            return {
                authorized: false
            }
        }
        const jwtPayload = await jwt.verify(bearer);

        if (!jwtPayload) {
            set.status = 401;

            return {
                authorized: false
            }
        }
        const id = jwtPayload.id;
        const user = User.FindById(id as number | string) as UserType;

        if (!user.isAdmin) {
            set.status = 403;

            return {
                isAdmin: false
            }
        }

        return {
            isAdmin: true
        }
   })
}