import { appError } from "../../core/utils/appError";
import { Reservation, Seat } from "../../model/booking.model";
import mongoose from "mongoose";
export class bookingService {
  static getMyReservationDetails = async ({
    userId,
    seatId,
  }: {
    userId: string;
    seatId: string;
  }) => {
    const data = await Reservation.findOne({ userId, seatId });
    return data?.toJSON();
  };
  static createReservation = async ({
    seatId,
    userId,
  }: {
    userId: string;
    seatId: string;
  }) => {
    const seat = await Seat.findOne({ _id: seatId });
    if (!seat) throw new appError("Seat does not exist", 404, "NOT_FOUND");
    if (seat.status !== "AVAILABLE")
      throw new appError("Seat is not available", 400, "BAD_REQUEST");
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Seat.updateOne({ _id: seatId }, { status: "RESERVED" });
      Reservation.create({
        eventId: seat.eventId,
        userId,
        seatId,
      });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };
  static conformReservation = async ({
    seatId,
    userId,
  }: {
    seatId: string;
    userId: string;
  }) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const updateResult = await Reservation.updateOne(
        { seatId, status: "PENDING", userId },
        { $set: { status: "CONFIRMED" } },
        { session },
      );

      if (!updateResult.modifiedCount) {
        throw new appError("Invalid or already processed reservation", 400);
      }

      await Seat.updateOne(
        { _id: seatId },
        { $set: { status: "BOOKED" } },
        { session },
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    return { userId, seatId };
  };
  static cancelReservation = async ({
    seatId,
    userId,
  }: {
    seatId: string;
    userId: string;
  }) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const result = await Reservation.updateOne(
        {
          seatId,
          userId,
          status: { $in: ["PENDING", "CONFIRMED"] },
        },
        { $set: { status: "CANCELLED" } },
        { session },
      );

      if (!result.modifiedCount) {
        throw new appError(
          "Reservation does not exist or already processed",
          404,
          "NOT_FOUND",
        );
      }

      // 3. Free the seat (only if reservation cancelled)
      await Seat.updateOne(
        { _id: seatId },
        { $set: { status: "AVAILABLE" } },
        { session },
      );

      await session.commitTransaction();
      return { seatId, userId };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };
}
