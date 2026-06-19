import mongoose, { Schema } from "mongoose";
import { schemaCleanOptions } from "../core/helper/mongooseCleaner";

interface IEvent extends Document {
  name: string;
  date: Date;
  venue: string;
  totalSeats: number;
  createdAt: Date;
}


const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  schemaCleanOptions,
);

export const Event = mongoose.model<IEvent>("Event", eventSchema);


