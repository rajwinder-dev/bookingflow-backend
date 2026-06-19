import { Seat } from "../../model/booking.model";
import { Event } from "../../model/event.model";
import { CreateEventInput } from "./event.zod";

export class EventService {
  static createEvent =async (event: CreateEventInput) => {
    const data = await Event.create(event);
    const seats = Array.from({ length: event.totalSeats }, (_, index) => ({
      eventId: data._id,
      seatNumber: index + 1,
      status: "AVAILABLE",
    }))
    await Seat.insertMany(seats);
    return data.toJSON()
  };
  static updateEvent =async (id: string, event: CreateEventInput) => {
    const data = await Event.updateOne({ _id: id }, event);
    return data
  };
  static getEvents =async () => {
    const data = await Event.find();
    return data.map(doc => doc.toJSON())
  };
  static getEventDetails =async (id: string) => {
    const data = await Event.findOne({ _id: id });
    const Seats = await Seat.find({ eventId: id }, { eventId: 0 });
    return {data: data?.toJSON(), Seats: Seats.map(doc => doc.toJSON())}
  };
}
