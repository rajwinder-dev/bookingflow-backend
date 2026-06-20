import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { createReservationSchema } from "./booking.zod";

export const bookingRouter = Router();

bookingRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.restrictedRole("user"),
);
bookingRouter.post("/:eventId/reserve", validationMiddleware(createReservationSchema), BookingController.createReservation);
bookingRouter.patch("/:eventId/confirm", BookingController.confirmReservation);

bookingRouter.get("/", BookingController.getReserverdSeats);
export default bookingRouter;
