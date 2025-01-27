import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo Application APIs",
      description: "Todo Application APIs",
      version: "0.0.0",
    },
    servers: [{ url: "http://localhost:8080" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./index.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
