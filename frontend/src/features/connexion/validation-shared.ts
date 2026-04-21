import { z } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function flattenErrors<T>(err: z.ZodError): FieldErrors<T> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out as FieldErrors<T>;
}
