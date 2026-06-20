import cron from "node-cron";
import { Seat } from "./model/reservation.model";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const expired = await Seat.updateMany(
    { status: "RESERVED", expiresAt: { $lt: now } },
    { $set: { status: "AVAILABLE", reservedBy: null } },
  );
  console.log("Expired", expired.modifiedCount);
});
