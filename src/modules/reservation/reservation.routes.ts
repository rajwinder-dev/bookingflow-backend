import { Router } from "express";
import { ReservationController } from "./reservation.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { createReservationSchema } from "./reservation.zod";

export const reservationRouter = Router();

reservationRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.restrictedRole("user"),
);
reservationRouter.post("/:eventId/reserve", validationMiddleware(createReservationSchema), ReservationController.createReservation);
reservationRouter.patch("/:eventId/confirm", ReservationController.confirmReservation);

reservationRouter.get("/", ReservationController.getReserverdSeats);
export default reservationRouter;
