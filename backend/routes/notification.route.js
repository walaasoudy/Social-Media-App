import express from "express";
import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notification.controller.js";
import { protectedRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification operations
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications fetched successfully
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NotificationOutput'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", protectedRoute, getNotifications);

/**
 * @swagger
 * /notifications:
 *   delete:
 *     summary: Delete all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/", protectedRoute, deleteNotifications);

export default router;
