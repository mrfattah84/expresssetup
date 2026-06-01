// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import joiToSwagger from "joi-to-swagger";
const j2s = joiToSwagger.default || joiToSwagger;
import { register, login } from "../validations/schemas.js";

const { swagger: registerSwaggerSchema } = j2s(register);
const { swagger: loginSwaggerSchema } = j2s(login);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: "http://localhost:5000/api/" }],
    security: [
      {
        bearerAuth: [],
      },
    ],

    components: {
      securitySchemes: {
        // Your existing access token setup
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        // 1. ADD THE REFRESH COOKIE SCHEME HERE
        refreshCookie: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken", // <-- This must exactly match your actual cookie key name
          description: "An HTTP-only cookie containing the refresh token.",
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication and authorization endpoints",
      },
    ],
    paths: {
      "/auth/register": {
        post: {
          summary: "Create a new user",
          tags: ["Auth"], // <-- This groups it under "Auth"
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: registerSwaggerSchema, // <-- Injecting generated schema here
              },
            },
          },
          responses: {
            201: { description: "User created" },
            400: { description: "Bad Request" },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "logs the user in",
          tags: ["Auth"], // <-- This groups it under "Auth"
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: loginSwaggerSchema, // <-- Injecting generated schema here
              },
            },
          },
          responses: {
            200: {
              description:
                "Login successful. Returns access token in body, sets refresh token in cookie.",
              // Optional: You can document that a cookie is being returned to the client
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
              headers: {
                "Set-Cookie": {
                  schema: {
                    type: "string",
                    example: "refreshToken=abc123xyz; HttpOnly; Secure;",
                  },
                  description: "Sets the HTTP-only refresh token cookie.",
                },
              },
            },
            400: { description: "Bad Request" },
            404: { description: "Bad Request" },
          },
        },
      },
      "/auth/refresh": {
        post: {
          summary: "Refresh Access Token",
          tags: ["Auth"],
          security: [
            {
              refreshCookie: [], // <-- Tells Swagger this route expects the cookie
            },
          ],
          responses: {
            200: {
              description: "Token refreshed successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Invalid or expired refresh token." },
            400: { description: "bad request." },
            403: { description: "bad request." },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // glob pattern pointing to your route files
};

export default swaggerJsdoc(options);
