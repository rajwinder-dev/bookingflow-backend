import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { bookingService } from "./booking.service";

export class BookingController {
  static createReservation = catchAsync(async (req, res, _next) => {
    const {seatId} = req.params;
    const data = await bookingService.createReservation({userId: req.user.id, seatId});
    response(res, data, 201);
  })
  static confirmReservation = catchAsync(async (req, res, _next) => {
    const {seatId} = req.params;
    const data = await bookingService.conformReservation({userId: req.user.id, seatId});
    response(res, data, 200);    
  }) 
  static cancelReservation = catchAsync(async (req, res, _next) => {
    const {seatId} = req.params;
    const data = await bookingService.cancelReservation({userId: req.user.id, seatId});
    response(res, data, 200);    
  })
  static getReservationDetails = catchAsync(async (req, res, _next) => {
    const {seatId} = req.params;
    const data = await bookingService.getMyReservationDetails({userId: req.user.id, seatId});
    response(res, data, 200);    
  })
}
