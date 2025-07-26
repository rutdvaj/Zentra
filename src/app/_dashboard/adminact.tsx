"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trip } from "../_types";
import { tripSchema } from "../_types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTripFormStore } from "../_store/tripstore";
import { supabase } from "../auth/client";
import { defaultHangers } from "../_types";
import { defaultTrucks } from "../_types";
import React from "react";
import { ComboboxPopover } from "../_components/dropdown";

function Adminact() {
  const hangers = defaultHangers.map((hanger) => ({
    value: hanger,
    label: hanger,
  }));

  const trucks = defaultTrucks.map((truck) => ({
    value: truck,
    label: truck,
  }));
  const { destination, vehicleNumber, setDestination, setVehicleNumber } =
    useTripFormStore();
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    const id = crypto.randomUUID();
    const now = new Date();
    const date = now.toISOString().slice(0, 10);

    const etaDate = new Date(now);
    etaDate.setMinutes(etaDate.getMinutes() + 30); // ETA offset
    const eta = etaDate.toTimeString().slice(0, 8);

    const newTrip: Trip = {
      date,
      eta,
      origin: "HUB",
      destinations: destination as Trip["destinations"],
      vehicles: vehicleNumber as Trip["vehicles"],
    };

    const result = tripSchema.safeParse(newTrip);
    if (!result.success) {
      console.error("Zod Validation Error:", result.error.errors);
      setError("Validation failed.");
      return;
    }

    const { data, error } = await supabase.from("trips").insert([result.data]);

    if (error) {
      console.log(error.message);
    } else {
      console.log([result.data]);
    }
  };
  return (
    <div>
      <Dialog>
        <form onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              Create New trips
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add trips</DialogTitle>
              <DialogDescription className="text-red-600">
                THIS IS A ADMIN ONLY ACTION
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <ComboboxPopover
                label="Destination"
                options={hangers}
                defaultValue="hanger3"
                onSelect={(option) => setDestination(option.value)}
              />
              <ComboboxPopover
                label="Truck"
                options={trucks}
                defaultValue="truck1"
                onSelect={(option) => setVehicleNumber(option.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  onClick={handleSubmit}
                >
                  Add trip
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

export default Adminact;
