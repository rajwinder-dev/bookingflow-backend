import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { bookingService } from "./booking.service";
import { CreateReservationInput } from "./booking.zod";

export class BookingController {
  static createReservation = catchAsync(async (req, res, _next) => {
    const { seatIds } = req.body as CreateReservationInput;
    const data = await bookingService.createReservation({
      userId: req.user.id,
      seatIds,
    });
    response(res, data, 201);
  });
  static getReserverdSeats = catchAsync(async (req, res, _next) => {
    const data = await bookingService.getReserverdSeats({
      userId: req.user.id,
    });
    response(res, data, 200);
  });
  static confirmReservation = catchAsync(async (req, res, _next) => {
    const data = await bookingService.confirmReservation({
      userId: req.user.id,
      eventId: req.params.eventId,
    });
    response(res, data, 200);
  });
}
