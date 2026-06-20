import mongoose, { Schema, Document, Types } from "mongoose";
import { schemaCleanOptions } from "../core/helper/mongooseCleaner";

export type SeatStatus = "AVAILABLE" | "BOOKED" | "RESERVED";

interface ISeat extends Document {
  eventId: Types.ObjectId;
  seatNumber: number;
  status: SeatStatus;
  reservedBy: Types.ObjectId | null;
  expiresAt: Date;
}

const seatSchema = new Schema<ISeat>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    seatNumber: { type: Number, required: true },
    reservedBy: { type: Schema.Types.ObjectId, ref: "Auth" },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 1 * 60 * 1000),
    },
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
  paymentId: string;
  status: ReservationStatus;
  cost: number;
}

const reservationSchema = new Schema<IReservation>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
    paymentId: { type: String },
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
