
import { create } from "zustand";

type TripFormState = {
  destination: string;
  vehicleNumber: string;
  setDestination: (value: string) => void;
  setVehicleNumber: (value: string) => void;
};

export const useTripFormStore = create<TripFormState>((set) => ({
  destination: "hanger-1",
  vehicleNumber: "TRUCK-101",
  setDestination: (value) => set({ destination: value }),
  setVehicleNumber: (value) => set({ vehicleNumber: value }),
}));

interface TripFormState2 {
  destination: string;
  vehicleNumber: string;
  trips: any[]; // Add this line
  isLoading: boolean;
  setDestination: (value: string) => void;
  setVehicleNumber: (value: string) => void;
  setTrips: (trips: any[]) => void; // Add this line
}

export const useTripFormStore2 = create<TripFormState2>((set) => ({
  destination: "", // ← Empty string instead of "hanger-1"
  vehicleNumber: "", // ← Empty string instead of "TRUCK-101"
  trips: [] as any[],
  isLoading: true,
  setDestination: (value) => set({ destination: value }),
  setVehicleNumber: (value) => set({ vehicleNumber: value }),
  setTrips: (trips : any[]) => set({ trips }),
}));

// Constants


const HUB: [number, number] = [22.3362, 73.2276];
const HANGARS = {
  'hanger-1': [22.337, 73.227],
  'hanger-2': [22.337, 73.2282],
  'hanger-3': [22.3354, 73.227],
  'hanger-4': [22.3354, 73.2282],
} satisfies Record<string, [number, number]>; // <-- no readonly

export type HangarId = keyof typeof HANGARS;
export type TripPhase = 'ONGOING' | 'RETURNING' | 'COMPLETED';

interface Trip {
  id: string;
  vehicle: string;
  hangar: HangarId;
  currentPos: [number, number];
  phase: TripPhase;
}

interface TripStore {
  trips: Trip[];
  initializeTrips: (newTrips: { id: string; vehicle: string; hangar: HangarId }[]) => void;
  tick: () => void;
  resetAllTrips: () => void;
}

// MUCH slower movement for visible animation
// The distance from hub to hangars is roughly 0.001-0.002 degrees
// So we want the trip to take several seconds to complete
const POSITION_TOLERANCE = 0.000005; // Much smaller tolerance - must be very close
const MOVEMENT_SPEED = 0.000008; // Much slower speed - about 125 steps to travel 0.001 degrees

// At 60fps, this means roughly 2 seconds per 0.001 degrees of travel
// Total trip time: hub->hangar->hub will be about 6-10 seconds

function isClose(pos1: [number, number], pos2: [number, number]): boolean {
  const distance = Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
  );
  return distance < POSITION_TOLERANCE;
}

function moveToward(
  from: [number, number],
  to: [number, number],
  speed = MOVEMENT_SPEED
): [number, number] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < speed || dist === 0) return to;

  const ratio = speed / dist;
  return [from[0] + dx * ratio, from[1] + dy * ratio];
}

// Helper function to calculate distance for debugging
function calculateDistance(pos1: [number, number], pos2: [number, number]): number {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
  );
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],

  initializeTrips: (newTrips) =>
    set((state) => {
      const existingIds = new Set(state.trips.map((t) => t.id));
      const newEntries: Trip[] = newTrips
        .filter((t) => !existingIds.has(t.id))
        .map((t) => ({
          id: t.id,
          vehicle: t.vehicle,
          hangar: t.hangar,
          currentPos: [HUB[0], HUB[1]] as [number, number],
          phase: 'ONGOING' as TripPhase,
        }));
      
      if (newEntries.length > 0) {
        console.log('🚛 Initializing trips:', newEntries.map(t => ({
          id: t.id,
          vehicle: t.vehicle,
          hangar: t.hangar,
          distanceToHangar: calculateDistance(HUB, HANGARS[t.hangar]).toFixed(6)
        })));
      }
      
      return { trips: [...state.trips, ...newEntries] };
    }),

  tick: () => {
    const currentState = get();
    const hasActiveTrips = currentState.trips.some(trip => trip.phase !== 'COMPLETED');
    
    if (!hasActiveTrips) return;

    set((state) => {
      let hasChanges = false;
      
      const newTrips = state.trips.map((trip) => {
        if (trip.phase === 'COMPLETED') return trip;

        const target =
          trip.phase === 'ONGOING'
            ? [HANGARS[trip.hangar][0], HANGARS[trip.hangar][1]] as [number, number]
            : [HUB[0], HUB[1]] as [number, number];

        const nextPos = moveToward(trip.currentPos, target);
        const reached = isClose(nextPos, target);
        
        // Calculate distances for debugging
        const currentDistance = calculateDistance(trip.currentPos, target);
        const newDistance = calculateDistance(nextPos, target);

        let nextPhase: TripPhase = trip.phase;
        if (trip.phase === 'ONGOING' && reached) {
          nextPhase = 'RETURNING';
          console.log(`🏁 Trip ${trip.id} (${trip.vehicle}) reached ${trip.hangar}, now returning to hub`);
        } else if (trip.phase === 'RETURNING' && reached) {
          nextPhase = 'COMPLETED';
          console.log(`✅ Trip ${trip.id} (${trip.vehicle}) completed and returned to hub`);
        }

        // Log movement progress occasionally (every ~30 frames for ongoing trips)
        if (trip.phase === 'ONGOING' && Math.random() < 0.033) {
          const totalDistance = calculateDistance(HUB, HANGARS[trip.hangar]);
          const travelledDistance = totalDistance - currentDistance;
          const progressPercent = ((travelledDistance / totalDistance) * 100).toFixed(1);
          console.log(`🚛 ${trip.vehicle} → ${trip.hangar}: ${progressPercent}% (${currentDistance.toFixed(6)} remaining)`);
        }

        const posChanged = nextPos[0] !== trip.currentPos[0] || nextPos[1] !== trip.currentPos[1];
        const phaseChanged = nextPhase !== trip.phase;
        
        if (posChanged || phaseChanged) {
          hasChanges = true;
        }

        return {
          ...trip,
          currentPos: reached ? target : nextPos,
          phase: nextPhase,
        };
      });

      return hasChanges ? { trips: newTrips } : state;
    });
  },

  resetAllTrips: () => 
    set(() => {
      console.log('🔄 Resetting all trips');
      return { trips: [] };
    }),
}));