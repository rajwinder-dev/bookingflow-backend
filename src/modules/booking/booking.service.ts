import { appError } from "../../core/utils/appError";
import { Reservation, Seat } from "../../model/booking.model";
import mongoose from "mongoose";
export class bookingService {
  static createReservation = async ({
    seatIds,
    userId,
  }: {
    userId: string;
    seatIds: string[];
  }) => {
    let seats;
    const session = await mongoose.startSession();
    const availableSeats = await Seat.find({
      _id: { $in: seatIds },
      status: "AVAILABLE",
    }).session(session);

    if (availableSeats.length !== seatIds.length) {
      throw new appError("Some seats are not available", 409, "BAD_REQUEST");
    }
    try {
      session.startTransaction();

      seats = await Seat.updateMany(
        {
          _id: { $in: seatIds },
          status: "AVAILABLE",
        },
        {
          $set: {
            status: "RESERVED",
            reservedBy: userId,
            expiresAt: new Date(Date.now() + 60 * 1000),
          },
        },
        {
          session,
        },
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    return seats;
  };
  static getReserverdSeats = async ({ userId }: { userId: string }) => {
    const reservedSeats = await Seat.find({
      reservedBy: userId,
      status: "RESERVED",
    });
    return reservedSeats.map((seat) => seat.toJSON());
  };
  static confirmReservation = async ({
    userId,
    eventId,
  }: {
    userId: string;
    eventId: string;
  }) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const seats = await Seat.find(
        {
          reservedBy: userId,
          eventId,
          status: "RESERVED",
        },
        null,
        { session },
      );

      if (!seats.length) {
        throw new appError("No reserved seats found", 404, "NOT_FOUND");
      }

      const seatIds = seats.map((seat) => seat._id);

      const paymentId = `PAY-${Date.now()}`;

      const reservation = new Reservation({
        userId,
        eventId,
        seatIds,
        paymentId,
        status: "CONFIRMED",
      });

      await reservation.save({ session });

      await Seat.updateMany(
        {
          _id: { $in: seatIds },
        },
        {
          $set: {
            status: "BOOKED",
          },
        },
        { session },
      );

      await session.commitTransaction();

      return reservation.toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };
}
