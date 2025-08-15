"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TripRender from "../_dashboard/triprender";

// import AirportMap from "../_dashboard/mapview";
import dynamic from "next/dynamic";
import ProtectedLayout from "./protect";
import { redirect } from "next/navigation";
const AirportMap = dynamic(() => import("../_dashboard/mapview"), {
  ssr: false,
});

export default function Oglayout() {
  return (
    <ProtectedLayout>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 z-10">
                <TripRender />
                <SectionCards />
              </div>
              <div className="px-4 lg:px-6 z-0">
                <AirportMap />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
