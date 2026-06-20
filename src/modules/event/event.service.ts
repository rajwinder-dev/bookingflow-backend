import { Seat } from "../../model/reservation.model";
import { Event } from "../../model/event.model";
import { CreateEventInput } from "./event.zod";

export class EventService {
  static createEvent = async (event: CreateEventInput) => {
    const data = await Event.create(event);
    const seats = Array.from({ length: event.totalSeats }, (_, index) => ({
      eventId: data._id,
      seatNumber: index + 1,
      status: "AVAILABLE",
    }));
    await Seat.insertMany(seats);
    return data.toJSON();
  };
  static updateEvent = async (id: string, event: CreateEventInput) => {
    const data = await Event.updateOne({ _id: id }, event);
    return data;
  };
  static getEvents = async () => {
    const events = await Event.find();
    const eventIds = events.map((event) => event._id);

    const seats = await Seat.find({ eventId: { $in: eventIds } });

    return events.map((event) => {
      const eventSeats = seats.filter(
        (seat) => seat.eventId.toString() === event._id.toString(),
      );

      const seatsLeft = eventSeats.filter(
        (seat) => seat.status === "AVAILABLE",
      ).length;

      return {
        ...event.toJSON(),
        seatsLeft,
      };
    });
  };
  static getEventDetails = async (id: string) => {
    const [data, seats] = await Promise.all([
      Event.findOne({ _id: id }),
      Seat.find({ eventId: id }, { eventId: 0 }),
    ]);

    const seatsLeft = seats.filter(
      (seat) => seat.status === "AVAILABLE",
    ).length;

    return {
      ...data?.toJSON(),
      Seats: seats.map((doc) => ({
        ...doc.toJSON(),
        reservedBy: doc.reservedBy?.toJSON(),
      })),
      seatsLeft,
    };
  };
}
