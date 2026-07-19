import "server-only";
import { z } from "zod";

const colorName = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[a-zA-Z0-9#(),.%\s-]+$/);

const colorResultSchema = z.object({
  background_color: colorName,
  font_color: colorName,
  date: z.coerce.date().optional(),
});

const sizeResultSchema = z.object({
  eye: z.enum(["right", "left"]).default("right"),
  fontSize: z.coerce.number().min(1).max(30),
  distance: z.coerce.number().min(0.1).max(10),
  date: z.coerce.date().optional(),
});

const fieldResultSchema = z.object({
  side: z.enum(["right", "left"]),
  distance: z.coerce.number().min(-30).max(30),
  date: z.coerce.date().optional(),
});

const resultsUpdateSchema = z
  .object({
    colorWeaknesses: z
      .array(colorResultSchema)
      .max(500)
      .optional(),

    sizeWeaknesses: z
      .array(sizeResultSchema)
      .max(500)
      .optional(),

    fieldWeaknesses: z
      .array(fieldResultSchema)
      .max(500)
      .optional(),
  })
  .strict()
  .refine(
    (value) =>
      Object.values(value).filter(
        (item) => item !== undefined,
      ).length === 1,
    "Exactly one result collection can be updated at a time.",
  );

export function validateResultsUpdate(value) {
  return resultsUpdateSchema.safeParse(value);
}