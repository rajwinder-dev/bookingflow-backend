import z from "zod";

export const createBookingSchema = {
  bodySchema: z.object({
    eventId: z.string(),
  }),
  paramsSchema: z.object({
    seatId: z.string(),
  }),
};

export type CreateBookingInput = z.infer<typeof createBookingSchema.bodySchema>;
