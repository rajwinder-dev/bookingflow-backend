import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvent {
  name: string;
  timeStamp: Date;
  venus: string; // Fixed typo from 'venus' to 'venue' if intended, kept 'venus' to match original
  totalSeats: number;
}

export interface IEventDocument extends IEvent, Document {}

const eventSchema = new Schema<IEventDocument>({
  name: { type: String, required: true },
  timeStamp: { type: Date, required: true },
  venus: { type: String, required: true },
  totalSeats: { type: Number, required: true },
});

export const Event = mongoose.model<IEventDocument>("Event", eventSchema);

export type SeatStatus = "AVAILABLE" | "BOOKED" | "RESERVED";

export interface ISeat {
  eventId: Types.ObjectId;
  seatNumber: number;
  status: SeatStatus;
}

export interface ISeatDocument extends ISeat, Document {}

const seatSchema = new Schema<ISeatDocument>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  seatNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ["AVAILABLE", "BOOKED", "RESERVED"],
    required: true,
    default: "AVAILABLE",
  },
});

export const Seat = mongoose.model<ISeatDocument>("Seat", seatSchema);



export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface IReservation {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  seatId: Types.ObjectId;
  status: ReservationStatus;
}

export interface IReservationDocument extends IReservation, Document {}

const reservationSchema = new Schema<IReservationDocument>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
  seatId: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    required: true,
    default: "PENDING",
  },
});

export const Reservation = mongoose.model<IReservationDocument>("Reservation", reservationSchema);
