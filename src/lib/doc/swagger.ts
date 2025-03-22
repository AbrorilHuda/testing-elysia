import {swagger} from "@elysiajs/swagger"

export const myDocumentation =  swagger({
    documentation: {
      info: {
        title: "dc Doc",
        version: "1.0.0",
        description: "Aplikasi testing eleysiajs "
      },
      components: {
        securitySchemes: {
          JwtAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      servers: [{url: "http://localhost:3000"}]
    },
    swaggerOptions: {
      persistAuthorization: true
    }
  })