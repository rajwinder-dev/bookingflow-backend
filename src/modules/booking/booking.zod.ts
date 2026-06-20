import z from "zod";

export const createReservationSchema = {
  bodySchema: z.object({
    seatIds: z.array(z.string()),
  }),
  paramsSchema: z.object({
    eventId: z.string(),
  }),
};
export type CreateReservationInput = z.infer<
  typeof createReservationSchema.bodySchema
>;
