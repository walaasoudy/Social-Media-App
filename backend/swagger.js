import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description:
        "API documentation for a simple social media application backend.",
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter the Bearer token (JWT) obtained from login. Example: `Bearer YOUR_TOKEN`",
        },
      },
      schemas: {
        UserOutput: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
            username: { type: "string", example: "johndoe" },
            email: { type: "string", example: "johndoe@example.com" },
            fullName: { type: "string", example: "John Doe" },
            bio: { type: "string", example: "I love coding!" },
            profileImg: {
              type: "string",
              format: "url",
              example: "https://example.com/images/profile.jpg",
            },
            coverImg: {
              type: "string",
              format: "url",
              example: "https://example.com/images/cover.jpg",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Unauthorized" },
                },
              },
            },
          },
        },
        NotFound: {
          description: "The requested resource was not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Resource not found" },
                },
              },
            },
          },
        },
        BadRequest: {
          description: "The request was invalid or cannot be served",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Invalid request data" },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: "An unexpected error occurred on the server",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Something went wrong" },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./controllers/*.js"),
  ],
};

export default swaggerOptions;
