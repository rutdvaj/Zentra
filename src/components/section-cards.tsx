"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { supabase } from "@/app/auth/client";

import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTripFormStore2 } from "@/app/_store/tripstore";
import { useEffect } from "react";
import TripRender from "@/app/_dashboard/triprender";

export function SectionCards() {
  // interface Trip {
  //   id: string;
  //   destinations: string;
  //   vehicles: string;
  //   date: string;
  //   eta: string;
  //   // Add other fields as needed
  // }

  const { trips, setTrips } = useTripFormStore2();

  // console.log("SectionCards - trips:", trips);
  // console.log("SectionCards - trips type:", typeof trips);
  // console.log("SectionCards - trips length:", trips.length);
  // console.log("SectionCards - is trips an array?", Array.isArray(trips));

  if (trips.length === 0) {
    return <div>Loading trips...</div>;
  }

  trips.forEach((trip) => {
    // console.log("Trip object:", trip);
    // console.log("Trip destination:", trip.destinations);
    // console.log("Trip vehicleNumber:", trip.vehicles);
  });

  const handleDeleteTrip = async (tripid: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase.from("trips").delete().eq("id", tripid);

      if (error) {
        // console.error("Delete error:", error.message);
        return;
      }

      // Update global state - remove the deleted trip
      const updatedTrips = trips.filter((trip) => trip.id !== tripid);
      setTrips(updatedTrips);

      // console.log("Trip deleted successfully");
    } catch (error) {
      // console.error("Delete failed:", error);
    }
  };

  return (
    <div className="w-full px-4 lg:px-6">
      <TripRender />

      <Carousel className="w-full px-12 mr-10">
        <CarouselContent className="-ml-2 md:-ml-4">
          {trips.map((trip) => (
            <CarouselItem
              key={trip.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="p-1">
                <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
                  <CardHeader>
                    <CardDescription>Trip Destination</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {trip.destinations}
                    </CardTitle>
                    <CardAction>
                      <Badge
                        variant="outline"
                        className="bg-green w-[70px] h-[26px]"
                      >
                        Ongoing
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex items-start justify-between gap-1.5 text-sm">
                    <div className="flex-col">
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Vehicle: {trip.vehicles}{" "}
                        <IconTrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Trip details and status
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red text-white cursor-pointer">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the trip from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red text-white cursor-pointer"
                            onClick={() => handleDeleteTrip(trip.id)}
                          >
                            DELETE
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
      </Carousel>
    </div>
  );
}
