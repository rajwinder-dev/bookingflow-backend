import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { reservationService } from "./reservation.service";
import { CreateReservationInput } from "./reservation.zod";

export class ReservationController {
  static createReservation = catchAsync(async (req, res, _next) => {
    const { seatIds } = req.body as CreateReservationInput;
    const data = await reservationService.createReservation({
      userId: req.user.id,
      seatIds,
    });
    response(res, data, 201);
  });
  static getReserverdSeats = catchAsync(async (req, res, _next) => {
    const data = await reservationService.getReserverdSeats({
      userId: req.user.id,
    });
    response(res, data, 200);
  });
  static confirmReservation = catchAsync(async (req, res, _next) => {
    const { eventId } = req.params as { eventId: string };
    const data = await reservationService.confirmReservation({
      userId: req.user.id,
      eventId,
    });
    response(res, data, 200);
  });
}
