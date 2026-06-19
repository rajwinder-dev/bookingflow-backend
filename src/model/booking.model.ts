import mongoose, { Schema, Document, Types } from "mongoose";
import { schemaCleanOptions } from "../core/helper/mongooseCleaner";

export type SeatStatus = "AVAILABLE" | "BOOKED" | "RESERVED";

interface ISeat extends Document {
  eventId: Types.ObjectId;
  seatNumber: number;
  status: SeatStatus;
}

const seatSchema = new Schema<ISeat>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    seatNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "RESERVED"],
      required: true,
      default: "AVAILABLE",
    },
  },
  schemaCleanOptions,
);

export const Seat = mongoose.model<ISeat>("Seat", seatSchema);

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface IReservation extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  seatId: Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  status: ReservationStatus;
}

const reservationSchema = new Schema<IReservation>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    seatId: { type: Schema.Types.ObjectId, ref: "Seat", required: true },

    createdAt: { type: Date, default: Date.now },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
  },
  schemaCleanOptions,
);
reservationSchema.index(
  { expiresAt: 1 },
  { partialFilterExpression: { status: "PENDING" } },
);
export const Reservation = mongoose.model<IReservation>(
  "Reservation",
  reservationSchema,
);
