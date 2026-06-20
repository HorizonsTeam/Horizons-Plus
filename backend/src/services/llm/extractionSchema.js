import { z } from "zod";

export const ExtractionSchema = z.object({
  type:          z.enum(["train", "avion"]).nullable(),
  origin:        z.string().nullable(),
  destination:   z.string().nullable(),
  date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  criteria:      z.enum(["price_min", "price_max", "best_balance"]).nullable(),
  max_price:     z.number().nullable(),
  flexible_days: z.boolean(),
});
