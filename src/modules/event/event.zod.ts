import z from "zod";

export const createEventSchema = { bodySchema: z.object({
  name: z.string(),
  venue: z.string(),
  date: z.coerce.date(),
  totalSeats: z.number(),
})};

export const updateEventSchema = { bodySchema: z.object({
  name: z.string().optional(),
  venue: z.string().optional(),
  date: z.coerce.date().optional(),
  // totalSeats: z.number().optional(),
})};

export type CreateEventInput = z.infer<typeof createEventSchema.bodySchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema.bodySchema>;


