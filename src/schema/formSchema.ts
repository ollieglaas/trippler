import { z } from "zod";
import { PlaceValue } from "@/types/globalTypes";

export const formSchema = z.object({
  destination: z
    .object({ label: z.string(), value: z.custom<PlaceValue>() })
    .nullable()
    .refine((val) => val !== null, "Destination is required"),
  // days: z.number().min(1, "Days must be greater than 0"),
  dates: z.object({
    start: z
      .string()
      .nullable()
      .refine((val) => val !== null, "Start date is required"),
    end: z
      .string()
      .nullable()
      .refine((val) => val !== null, "End date is required"),
  }),
  budget: z.string().min(1, "Budget is required"),
  people: z.string().min(1, "People selection is required"),
});
