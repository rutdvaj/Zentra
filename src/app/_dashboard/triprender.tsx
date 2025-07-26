import React, { useEffect, useState } from "react";
import { supabase } from "../auth/client";
import { useTripFormStore2 } from "../_store/tripstore";

function TripRender() {
  const { trips, setTrips } = useTripFormStore2();
  const [loading, setLoading] = useState(true);
  // console.log("TripRender - Component mounted"); // Debug log
  useEffect(() => {
    // console.log("TripRender - useEffect running"); // Debug log
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    // console.log("TripRender - fetchTrips called"); // Debug log
    const { data, error } = await supabase.from("trips").select();

    if (data) {
      // console.log("TripRender - Data fetched:", data); // Debug log
      setTrips(data);
      // console.log(trips);
      // console.log("TripRender - setTrips called with:", data); // Debug log
      setLoading(false);
    } else if (error) {
      console.log(error.message);
    } else {
      <h1>{loading}</h1>;
    }
  };
  return (
    <div></div>
    // <div>
    //   {trips.map((trip: any) => (
    //     <div
    //       key={trip.id}
    //       style={{
    //         border: "1px solid #ccc",
    //         marginBottom: "1rem",
    //         padding: "1rem",
    //       }}
    //     >
    //       <p>
    //         <strong>Date:</strong> {trip.date}
    //       </p>
    //       <p>
    //         <strong>ETA:</strong> {trip.eta}
    //       </p>
    //       <p>
    //         <strong>Origin:</strong> {trip.origin}
    //       </p>
    //       <p>
    //         <strong>Destinations:</strong> {trip.destinations}
    //       </p>
    //       <p>
    //         <strong>Vehicles:</strong> {trip.vehicles}
    //       </p>
    //     </div>
    //   ))}
    // </div>
  );
}

export default TripRender;
