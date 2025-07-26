"use client";
import {
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  Tooltip,
  Polyline,
} from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";
import { useTripFormStore2 } from "../_store/tripstore"; // ← the "source‑of‑truth" trips
import { useTripStore, HangarId, TripPhase } from "../_store/tripstore"; // ← the new minimal animation store

/* ─────────────────────────────────  CONSTANTS  ────────────────────────────── */

const AIRPORT_CENTER: [number, number] = [22.3362, 73.2276];
const BOUNDS: [[number, number], [number, number]] = [
  [22.334, 73.225],
  [22.3384, 73.2302],
];

export const HUB: [number, number] = [22.3362, 73.2276];

export const HANGARS = {
  "hanger-1": [22.337, 73.227],
  "hanger-2": [22.337, 73.2282],
  "hanger-3": [22.3354, 73.227],
  "hanger-4": [22.3354, 73.2282],
} as const;

const HANGAR_RECT_SIZE = 0.0002;

/* ──────────────────────────────  SMALL HELPERS  ──────────────────────────── */

const colourForPhase = (p: TripPhase) =>
  p === "ONGOING"
    ? "#1DB954" // green
    : p === "RETURNING"
    ? "#F59E0B" // orange
    : "#065F46"; // dark green (completed)

const distance = (
  [aLat, aLng]: readonly [number, number],
  [bLat, bLng]: readonly [number, number]
) => Math.hypot(aLat - bLat, aLng - bLng);

const progressFor = (
  phase: TripPhase,
  pos: [number, number],
  hangar: HangarId
) => {
  if (phase === "COMPLETED") return 1;

  const target = HANGARS[hangar];
  const total =
    phase === "ONGOING" ? distance(HUB, target) : distance(target, HUB);

  const travelled =
    phase === "ONGOING" ? distance(HUB, pos) : distance(pos, HUB);

  return Math.min(travelled / total, 1);
};

/* ──────────────────────────────  COMPONENT  ──────────────────────────────── */

export default function AirportMap() {
  /* 1. Bring in trips from BOTH stores */
  const { trips: formTrips } = useTripFormStore2();
  const tripStore = useTripStore();
  const {
    trips: animatedTrips,
    initializeTrips,
    tick,
    resetAllTrips,
  } = tripStore;

  // Remove excessive console logs - only log when there are actual changes
  const prevFormTripsLength = useRef(formTrips.length);
  const prevAnimatedTripsLength = useRef(animatedTrips.length);

  if (formTrips.length !== prevFormTripsLength.current) {
    console.log("Form trips changed:", formTrips.length);
    prevFormTripsLength.current = formTrips.length;
  }

  if (animatedTrips.length !== prevAnimatedTripsLength.current) {
    console.log("Animated trips changed:", animatedTrips.length);
    prevAnimatedTripsLength.current = animatedTrips.length;
  }

  /* 2. Sync NEW trips from the form store into the animation store */
  const processedTripIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newTrips = formTrips.filter(
      (t) => !processedTripIds.current.has(t.id)
    );

    if (newTrips.length > 0) {
      console.log("Processing new trips:", newTrips);
      const formatted = newTrips.map((t) => ({
        id: t.id,
        vehicle: t.vehicles,
        hangar: t.destinations as HangarId,
      }));

      initializeTrips(formatted);

      // Mark these trips as processed
      newTrips.forEach((t) => processedTripIds.current.add(t.id));
    }
  }, [formTrips, initializeTrips]);

  /* 3. Animation loop - only start if there are active trips */
  const frameRef = useRef<number | null>(null);
  const activeTrips = animatedTrips.filter((t) => t.phase !== "COMPLETED");

  useEffect(() => {
    const startAnimation = () => {
      if (frameRef.current) return; // Already running

      const loop = () => {
        tick();
        frameRef.current = requestAnimationFrame(loop);
      };

      console.log(
        "🎬 Starting animation loop with",
        activeTrips.length,
        "active trips"
      );
      frameRef.current = requestAnimationFrame(loop);
    };

    const stopAnimation = () => {
      if (frameRef.current) {
        console.log("⏹️ Stopping animation loop");
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    if (activeTrips.length > 0) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return stopAnimation;
  }, [tick, activeTrips.length]); // Depend on activeTrips.length, not the array itself

  /* 4. Debug info */
  useEffect(() => {
    console.log("📊 Active trips count:", activeTrips.length);
    if (activeTrips.length > 0) {
      activeTrips.forEach((trip, index) => {
        console.log(
          `📍 Trip ${trip.id}: position [${trip.currentPos[0].toFixed(
            6
          )}, ${trip.currentPos[1].toFixed(6)}], phase: ${trip.phase}`
        );
      });
    }
  }, [activeTrips.length, animatedTrips]); // Log when trips or positions change

  /* 5. RENDER */
  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* Debug Panel */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "12px",
          maxWidth: "300px",
        }}
      >
        <div>
          <strong>Debug Info:</strong>
        </div>
        <div>Form Trips: {formTrips.length}</div>
        <div>Animated Trips: {animatedTrips.length}</div>
        <div>Active Trips: {activeTrips.length}</div>
        <div>Animation: {frameRef.current ? "🟢 Running" : "🔴 Stopped"}</div>
        <button
          onClick={resetAllTrips}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "10px",
          }}
        >
          Reset All Trips
        </button>
        {activeTrips.map((trip) => (
          <div key={trip.id} style={{ marginTop: "5px", fontSize: "10px" }}>
            <strong>{trip.vehicle}</strong> → {trip.hangar}
            <br />
            Phase: {trip.phase}
            <br />
            Pos: [{trip.currentPos[0].toFixed(4)},{" "}
            {trip.currentPos[1].toFixed(4)}]
          </div>
        ))}
      </div>

      <MapContainer
        center={AIRPORT_CENTER}
        zoom={16}
        style={{ height: "100vh", width: "100%" }}
        maxBounds={BOUNDS}
        scrollWheelZoom
        dragging
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© Esri"
        />

        {/* HUB */}
        <Marker position={HUB}>
          <Popup>
            <strong>Hub</strong>
            <br />
            Active Trips: {activeTrips.length}
            <br />
            Completed Trips: {animatedTrips.length - activeTrips.length}
          </Popup>
          <Tooltip direction="top" offset={[0, -10]} permanent>
            Hub
          </Tooltip>
        </Marker>

        {/* HANGAR zones */}
        {Object.entries(HANGARS).map(([name, [lat, lng]]) => (
          <Rectangle
            key={name}
            bounds={[
              [lat - HANGAR_RECT_SIZE, lng - HANGAR_RECT_SIZE],
              [lat + HANGAR_RECT_SIZE, lng + HANGAR_RECT_SIZE],
            ]}
            pathOptions={{ color: "#1D4ED8", weight: 2, fillOpacity: 0.3 }}
          >
            <Tooltip direction="center" permanent>
              {name}
            </Tooltip>
          </Rectangle>
        ))}

        {/* Routes & markers */}
        {activeTrips.map((trip) => (
          <Polyline
            key={`route-${trip.id}`}
            positions={[HUB, HANGARS[trip.hangar] as [number, number]]}
            pathOptions={{
              color: colourForPhase(trip.phase),
              weight: 2,
              opacity: 0.5,
              dashArray: "5,5",
            }}
          />
        ))}

        {activeTrips.map((trip) => (
          <Marker key={trip.id} position={trip.currentPos}>
            <Popup>
              <strong>Truck {trip.vehicle}</strong>
              <br />
              Hangar: {trip.hangar}
              <br />
              Phase:&nbsp;
              <span style={{ color: colourForPhase(trip.phase) }}>
                {trip.phase.toLowerCase()}
              </span>
              <br />
              Progress:{" "}
              {Math.round(
                progressFor(trip.phase, trip.currentPos, trip.hangar) * 100
              )}
              %
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
