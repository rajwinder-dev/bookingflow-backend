import cron from "node-cron";
import { Reservation, Seat } from "./model/booking.model";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const expired = await Reservation.find({
    status: "PENDING",
    expiresAt: { $lt: now },
  });

  const ids = expired.map(r => r._id);
  const seatIds = expired.map(r => r.seatId);

  await Reservation.updateMany(
    { _id: { $in: ids } },
    { $set: { status: "CANCELLED" } }
  );

  await Seat.updateMany(
    { _id: { $in: seatIds } },
    { $set: { status: "AVAILABLE" } }
  );
  if(expired.length > 0) {
    console.log("Expired", expired.length);
  }
});
