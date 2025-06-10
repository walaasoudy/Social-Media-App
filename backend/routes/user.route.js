import express from "express";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and interactions
 */

/**
 * @swagger
 * /user/profile/{username}:
 *   get:
 *     summary: Get a user's profile details by username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to fetch
 *         example: johndoe
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 user:
 *                   $ref: '#/components/schemas/UserOutput'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/profile/:username", protectedRoute, getUserProfile);

/**
 * @swagger
 * /user/suggested:
 *   get:
 *     summary: Get a list of suggested users to follow
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suggested users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserOutput'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/suggested", protectedRoute, getSuggestedUsers);

/**
 * @swagger
 * /user/follow/{id}:
 *   post:
 *     summary: Follow or unfollow a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to follow or unfollow
 *         example: 60d0fe4f7082f50015b6d912
 *     responses:
 *       200:
 *         description: User followed or unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User followed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/follow/:id", protectedRoute, followUnfollowUser);

/**
 * @swagger
 * /user/update:
 *   post:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated.email@example.com
 *               username:
 *                 type: string
 *                 example: updatedusername
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Required if newPassword is provided.
 *                 example: oldpassword
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (min 6 characters), requires currentPassword.
 *                 example: newstrongpassword
 *               bio:
 *                 type: string
 *                 example: Updated bio about my interests.
 *               link:
 *                 type: string
 *                 format: url
 *                 example: https://newwebsite.com
 *               profileImg:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded string of the new profile image.
 *               coverImg:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded string of the new cover image.
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserOutput'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/update", protectedRoute, updateUser);

export default router;
