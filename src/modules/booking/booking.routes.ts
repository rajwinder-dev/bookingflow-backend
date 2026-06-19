import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../auth/auth.middleware";

export const bookingRouter = Router();

bookingRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.restrictedRole("user"),
);
bookingRouter.post("/:seatId", BookingController.createReservation);
bookingRouter.get("/:seatId", BookingController.getReservationDetails);
bookingRouter.patch("/:seatId/confirm", BookingController.confirmReservation);
bookingRouter.patch("/:seatId/cancel", BookingController.cancelReservation);
export default bookingRouter;
