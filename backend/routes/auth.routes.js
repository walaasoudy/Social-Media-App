import express from "express";
import {
  login,
  logout,
  signup,
  getMe,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectRoute.js";

const router = express.Router(); // Fixed the typo here

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get details of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: [] # This endpoint requires authentication
 *     responses:
 *       200:
 *         description: Authenticated user details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 user:
 *                   $ref: '#/components/schemas/UserOutput' # Reference to UserOutput schema
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError' # Reference to common UnauthorizedError response
 *       404:
 *         $ref: '#/components/responses/NotFound' # Reference to common NotFound response (if user token is valid but user not found)
 *       500:
 *         $ref: '#/components/responses/InternalServerError' # Reference to common InternalServerError response
 */
router.get("/me", protectedRoute, getMe);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization operations
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (minimum 6 characters)
 *                 example: mysecretpassword123
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/UserOutput' # Reference to UserOutput schema
 *       400:
 *         $ref: '#/components/responses/BadRequest' # Reference to common BadRequest response
 *       500:
 *         $ref: '#/components/responses/InternalServerError' # Reference to common InternalServerError response
 */
router.post("/signup", signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user and obtain a JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: mysecretpassword123
 *     responses:
 *       200:
 *         description: User logged in successfully. JWT is set in an HTTP-only cookie.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=eyJhbGciOiJIUzI1NiI...; HttpOnly; Path=/; Max-Age=3600
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 user:
 *                   $ref: '#/components/schemas/UserOutput' # Reference to UserOutput schema
 *       400:
 *         $ref: '#/components/responses/BadRequest' # Reference to common BadRequest response
 *       500:
 *         $ref: '#/components/responses/InternalServerError' # Reference to common InternalServerError response
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: [] # This endpoint requires authentication to clear the correct session
 *     responses:
 *       200:
 *         description: User logged out successfully. JWT cookie is cleared.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError' # Reference to common UnauthorizedError response
 *       500:
 *         $ref: '#/components/responses/InternalServerError' # Reference to common InternalServerError response
 */
router.post("/logout", logout);

export default router;
