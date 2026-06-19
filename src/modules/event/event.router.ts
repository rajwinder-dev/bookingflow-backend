import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { createEventSchema, updateEventSchema } from "./event.zod";

const eventRouter = Router();

eventRouter.get("/", EventController.getEvents);

// eventRouter.use(authMiddleware.protectedRoute, authMiddleware.restrictedRole("admin"));
eventRouter.post("/", validationMiddleware(createEventSchema), EventController.createEvent);
eventRouter.patch("/:id",validationMiddleware(updateEventSchema), EventController.udpateEvent);
eventRouter.get("/:id", EventController.getEventDetails);

export default eventRouter;
