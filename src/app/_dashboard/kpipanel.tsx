import React from "react";
import { useTripFormStore2 } from "../_store/tripstore";
function KpiPanel() {
  const { trips } = useTripFormStore2();

  const ongoingTrips = trips.length;
  const activeTrucks = trips.length;
  const payloadDelivered = trips.length * 2000; // 2000kg per truck

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Operations Overview
      </h3>

      <div className="grid gap-4">
        {/* Ongoing Trips */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Ongoing Trips</p>
              <p className="text-2xl font-bold text-blue-900">{ongoingTrips}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🚛</span>
            </div>
          </div>
        </div>

        {/* Active Trucks */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Active Trucks
              </p>
              <p className="text-2xl font-bold text-green-900">
                {activeTrucks}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🚚</span>
            </div>
          </div>
        </div>

        {/* Payload Delivered */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Payload Delivered
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {payloadDelivered.toLocaleString()} kg
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">📦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KpiPanel;
