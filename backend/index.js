import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { Todo, User } from "./models.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /sign-up:
 *  post:
 *      summary: "Enables user to signup and acquire an JWT Authorization token and start managing their todos."
 *      description: "This API enables user to signup and acquire an JWT Authorization token and start managing their todos."
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        201:
 *           description: Created
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      success:
 *                        type: boolean
 *                      message:
 *                        type: string
 *                      token:
 *                        type: string
 *        409:
 *          description: Conflict
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 */
app.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;

  try {
    await mongoose.connect(process.env.DATABASE_URI);

    const existingUser = await User.findOne({
      username,
    });

    if (!existingUser) {
      const newUser = await User.create({
        username,
        password,
      });

      const token = jwt.sign(
        {
          userId: newUser._id,
        },
        process.env.JWT_SECRET_KEY
      );

      return res.status(201).json({
        success: true,
        message: "User sign up successful.",
        token,
      });
    }

    return res.status(409).json({
      success: false,
      message: "User already exists. Please try signing in.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while signing up.",
    });
  } finally {
    mongoose.connection.close();
  }
});

/**
 * @swagger
 * /sign-in:
 *  post:
 *      summary: "Enables user to signin and acquire an JWT Authorization token to gain access their Todos."
 *      description: "This API enables user to signin and acquire an JWT Authorization token to gain access their Todos."
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *           description: OK
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      success:
 *                        type: boolean
 *                      message:
 *                        type: string
 *                      token:
 *                        type: string
 *        404:
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 */
app.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;

  try {
    await mongoose.connect(process.env.DATABASE_URI);
    const userExists = await User.findOne({
      username: username,
      password: password,
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User with these creadentials does not exist.",
      });
    }

    const token = jwt.sign(
      {
        userId: userExists._id,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      message: "User sign in successful.",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while signing up.",
    });
  } finally {
    mongoose.connection.close();
  }
});

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Please signin/signup to proceed.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed.",
    });
  }
}

/**
 * @swagger
 * /get-todos:
 *  get:
 *      summary: "Fetches all the todos from the Todos collection for a user."
 *      description: "This API is used to fetch all the todos from the Todos collection for a user by matching the user's id."
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *           description: OK
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      success:
 *                        type: boolean
 *                      message:
 *                        type: string
 *                      todos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            description:
 *                             type: string
 *        401:
 *          description: "Error: Unauthorized"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 *
 */
app.get("/get-todos", authenticationMiddleware, async (req, res) => {
  const { userId } = req;

  try {
    await mongoose.connect(process.env.DATABASE_URI);
    const todos = await Todo.find({
      userId,
    }).select({ id: 1, title: 1, description: 1 });

    res.status(200).json({
      success: true,
      message: "Todos retrived successfully.",
      todos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while retreiving todos.",
    });
  } finally {
    mongoose.connection.close();
  }
});

/**
 * @swagger
 * /create-todo:
 *  post:
 *      summary: "Creates and stores a todo in a database along with the associated user's id."
 *      description: "This API is used to create and store a todo in a database along with the user's id."
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *      responses:
 *        201:
 *           description: Created
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      success:
 *                        type: boolean
 *                      message:
 *                        type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 */
app.post("/create-todo", authenticationMiddleware, async (req, res) => {
  const { userId } = req;
  const { title, description } = req.body;

  try {
    await mongoose.connect(process.env.DATABASE_URI);
    await Todo.create({
      title,
      description,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "New todo created successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while creating todo.",
    });
  } finally {
    mongoose.connection.close();
  }
});

/**
 * @swagger
 * /update-todo/{todoId}:
 *  put:
 *      summary: "Updates an existing todo in a database."
 *      description: "Given a parameter, todoId, this API finds the document within the Todos collection that matches it and updates that document."
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: todoId
 *          schema:
 *            type: string
 *          description: ID of the todo to be updated.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *      responses:
 *        200:
 *           description: OK
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      success:
 *                        type: boolean
 *                      message:
 *                        type: string
 *                      token:
 *                        type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 */
app.put("/update-todo/:todoId", authenticationMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const { todoId } = req.params;

  try {
    await mongoose.connect(process.env.DATABASE_URI);

    await Todo.findByIdAndUpdate(todoId, {
      title,
      description,
      updatedAt: Date(),
    });

    res.status(200).json({
      success: true,
      message: "Todo updated successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while updating todo up.",
    });
  } finally {
    mongoose.connection.close();
  }
});

/**
 * @swagger
 * /delete-todo/{todoId}:
 *  delete:
 *      summary: "Deletes an existing todo in a database."
 *      description: "Given a parameter, todoId, this API finds the document within the Todos collection that matches it and deletes that document."
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: todoId
 *          schema:
 *            type: string
 *          description: ID of the todo to be deleted.
 *      responses:
 *        200:
 *           description: OK
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      success:
 *                        type: boolean
 *                      message:
 *                        type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 */
app.delete(
  "/delete-todo/:todoId",
  authenticationMiddleware,
  async (req, res) => {
    const { todoId } = req.params;

    try {
      await mongoose.connect(process.env.DATABASE_URI);

      await Todo.findByIdAndDelete(todoId);

      res.status(200).json({
        success: true,
        message: "Todo deleted successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error while deleting todo.",
      });
    } finally {
      mongoose.connection.close();
    }
  }
);

app.listen(8080);
