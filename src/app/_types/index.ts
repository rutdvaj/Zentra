import { z } from "zod";
export const defaultHangers = ["hanger-1", "hanger-2", "hanger-3", "hanger-4"] as const;
export const defaultTrucks = ["TRUCK-101", "TRUCK-102", "TRUCK-103", "TRUCK-104"] as const;

export const tripSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    eta: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    origin: z.literal("HUB"),
    destinations: z.enum(defaultHangers),
    vehicles : z.enum(defaultTrucks),

})

// Trip states
export type TripState =
  | "pending"
  | "validated"
  | "initiated"
  | "en_route_to_hangar"
  | "at_hangar"
  | "en_route_to_hub"
  | "completed"
  | "eta_breached";


 export interface AnimatedTrip {
    id: string;
    vehicles: string;
    destinations: string;
    state: TripState;
    currentPosition: [number, number];
    targetPosition: [number, number];
    startTime: number;
    eta: number; // Expected time of arrival in milliseconds
    direction: "to_hangar" | "to_hub";
    progress: number; // 0 to 1
  }
  

export type Trip = z.infer<typeof tripSchema>;