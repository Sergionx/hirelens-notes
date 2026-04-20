import z from 'zod';

export const stringToDate = z.codec(z.iso.date(), z.date(), {
  decode: (date) => new Date(date),
  encode: (date) => date.toISOString(),
});

export function createStringToDateCodec({
  isoDateValidation,
  dateValidation,
}: {
  isoDateValidation?: (isoDate: z.ZodISODate) => z.ZodISODate;
  dateValidation?: (date: z.ZodDate) => z.ZodDate;
} = {}) {
  const baseIsoDate = z.iso.date();
  const baseDate = z.date();

  return z.codec(
    isoDateValidation?.(baseIsoDate) ?? baseIsoDate,
    dateValidation?.(baseDate) ?? baseDate,
    {
      decode: (date) => new Date(date),
      encode: (date) => date.toISOString(),
    },
  );
}
export const stringToDateTime = z.codec(z.iso.datetime({
  offset: true
}), z.date(), {
  decode: (date) => new Date(date),
  encode: (date) => date.toISOString(),
});
