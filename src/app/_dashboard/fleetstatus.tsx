import React from "react";
import { useTripFormStore2 } from "../_store/tripstore";

function FleetStatus() {
  const { trips } = useTripFormStore2();
  const totalfleet = 20;

  // Calculate fleet metrics
  const trucksInUse = trips.length;
  const trucksAvailable = totalfleet - trips.length;
  const fleetUtilizationRate = ((trucksInUse / totalfleet) * 100).toFixed(1);
  const totalFleetCapacity = totalfleet * 2000; // 2000kg per truck
  const capacityInUse = trucksInUse * 2000;
  const availableCapacity = trucksAvailable * 2000;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Fleet Status Overview
      </h3>

      <div className="grid gap-4">
        {/* Trucks in Use */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Trucks in Use
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {trucksInUse}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🚛</span>
            </div>
          </div>
        </div>

        {/* Trucks Available */}
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Trucks Available
              </p>
              <p className="text-2xl font-bold text-emerald-900">
                {trucksAvailable}
              </p>
            </div>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🚚</span>
            </div>
          </div>
        </div>

        {/* Fleet Utilization Rate */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Fleet Utilization Rate
              </p>
              <p className="text-2xl font-bold text-indigo-900">
                {fleetUtilizationRate}%
              </p>
            </div>
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">📊</span>
            </div>
          </div>
        </div>

        {/* Total Fleet Capacity */}
        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-600">
                Total Fleet Capacity
              </p>
              <p className="text-2xl font-bold text-cyan-900">
                {totalFleetCapacity.toLocaleString()} kg
              </p>
            </div>
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚖️</span>
            </div>
          </div>
        </div>

        {/* Capacity in Use */}
        <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600">
                Capacity in Use
              </p>
              <p className="text-2xl font-bold text-rose-900">
                {capacityInUse.toLocaleString()} kg
              </p>
            </div>
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">📦</span>
            </div>
          </div>
        </div>

        {/* Available Capacity */}
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600">
                Available Capacity
              </p>
              <p className="text-2xl font-bold text-teal-900">
                {availableCapacity.toLocaleString()} kg
              </p>
            </div>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleetStatus;
