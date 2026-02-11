import { z } from "zod";

export const unlockSchema = z.object({
  passcode: z.string().min(1, "Passcode is required"),
});

export type UnlockInput = z.infer<typeof unlockSchema>;
