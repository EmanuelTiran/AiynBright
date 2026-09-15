import "server-only";
import { z } from "zod";

function strictObject(shape) {
  // Zod intentionally drops __proto__; the API contract requires rejecting it.
  return z.unknown().refine((value) => !value || typeof value !== "object" ||
    !["__proto__", "constructor", "prototype"].some((key) => Object.hasOwn(value, key)))
    .pipe(z.object(shape).strict());
}

const colorName = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[a-zA-Z0-9#(),.%\s-]+$/);

const resultId = z.string().regex(/^[a-f0-9]{24}$/i).optional();
const resultDate = z.union([z.iso.datetime({ offset: true }), z.date()]).pipe(z.coerce.date()).optional();
const numericValue = z.union([z.number(), z.string().trim().min(1)]).pipe(z.coerce.number());

const colorResultSchema = strictObject({
  _id: resultId,
  background_color: colorName,
  font_color: colorName,
  date: resultDate,
});

const sizeResultSchema = strictObject({
  _id: resultId,
  eye: z.enum(["right", "left"]).default("right"),
  fontSize: numericValue.pipe(z.number().min(1).max(30)),
  distance: numericValue.pipe(z.number().min(0.1).max(10)),
  date: resultDate,
});

const fieldResultSchema = strictObject({
  _id: resultId,
  side: z.enum(["right", "left"]),
  distance: numericValue.pipe(z.number().min(-30).max(30)),
  date: resultDate,
});

const resultsUpdateSchema = strictObject({
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

export const updateRequestSchema = strictObject({
  updateData: resultsUpdateSchema,
});

export const deleteRequestSchema = strictObject({
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  field: z.enum(["color", "size", "field"]),
  index: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
});
