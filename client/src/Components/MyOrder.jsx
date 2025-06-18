import { useEffect, useRef, useState } from "react";

export default function MyOrder({
  order,
  isMobile,
  now,
  editingOrderId,
  setEditingOrderId,
  selectedTimeSlot,
  setSelectedTimeSlot,
  handleTimeSlotChange,
  handleSaveTimeSlot,
  handleCancelEdit,
  AVAILABLE_TIME_SLOTS,
  mobileTimeSlotSelect,
  mobileInputBorder,
}) {
  const created = new Date(order.createdAt).getTime();
  const tenMinutes = 10 * 60 * 1000;
  const processExpired = now - created > tenMinutes;

  // 1. While searching for partner (first 10 minutes)
  if (
    (order.requestStatus === "Pending" || order.status === "processing") &&
    !processExpired
  ) {
    const timeLeft = Math.max(0, tenMinutes - (now - created));
    const min = String(Math.floor(timeLeft / 60000)).padStart(2, "0");
    const sec = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0");
    return (
      <div className="mb-4 flex flex-col gap-2 px-3 py-2 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
          <span>
            Looking for a provider... <b>Your order is being processed.</b>
          </span>
        </div>
        <div className="pl-7 text-sm">
          <span>Time slot: <b>{order.address?.timeSlot}</b></span>
          <span className="ml-2">Auto-cancel in <b>{min}:{sec}</b></span>
        </div>
      </div>
    );
  }

  // 2. After 10 minutes, show "Order Declined" and remove time slot (UI only)
  if (
    (order.requestStatus === "Pending" || order.status === "processing") &&
    processExpired
  ) {
    return (
      <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700">
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>
          No provider accepted your request. <b>Order is declined.</b>
        </span>
      </div>
    );
  }

  // 3. Partner assigned but not yet accepted (waiting 30s)
  if (order.assignedPartner && order.requestStatus === "Pending" && !processExpired) {
    return (
      <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-800">
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
        </svg>
        <span>
          Your request has been sent to <b>{order.assignedPartner.name}</b>. If they accept, your order will be confirmed.
        </span>
      </div>
    );
  }

  // 4. Provider accepted the request (show details)
  if (order.requestStatus === "Accepted" && order.assignedPartner) {
    return (
      <div className="mb-4 flex flex-col gap-2 px-3 py-2 rounded-lg border border-green-300 bg-green-50 text-green-800">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Provider <b>{order.assignedPartner.name}</b> accepted your request. <b>Confirmed!</b>
          </span>
        </div>
        <div className="pl-7 text-sm">
          <div>
            <span className="font-bold">Email:</span>{" "}
            <a href={`mailto:${order.assignedPartner.email}`} className="underline text-blue-700">
              {order.assignedPartner.email}
            </a>
          </div>
          {order.assignedPartner.phone && (
            <div>
              <span className="font-bold">Phone:</span>{" "}
              <a href={`tel:${order.assignedPartner.phone}`} className="underline text-blue-700">
                {order.assignedPartner.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. Declined: Don't show provider name
  if (order.requestStatus === "Declined") {
    return (
      <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700">
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>
          Provider declined your request.
        </span>
      </div>
    );
  }

  // 6. No partner found (allow time slot selection)
  if (
    order.requestStatus === "NoPartner" ||
    order.requestStatus === "No service provider is available"
  ) {
    return (
      <>
        <div className={`mb-4 p-3 rounded-lg border ${isMobile ? "bg-red-100 text-red-700 border-red-300" : "bg-red-50 text-red-600 border-red-200"}`}>
          ⚠️ No provider was available in your selected time slot. Please choose a different time slot below.
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
          <select
            value={selectedTimeSlot}
            onChange={handleTimeSlotChange}
            className={`border rounded px-2 py-1 text-sm w-full sm:w-auto ${mobileTimeSlotSelect} ${mobileInputBorder}`}
          >
            <option value="">Select a time slot</option>
            {AVAILABLE_TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none px-3 py-1 rounded ${isMobile ? "bg-green-700 text-white" : "bg-green-600 text-white"} hover:bg-green-800 text-xs`}
              onClick={() => handleSaveTimeSlot(order)}
            >
              Save
            </button>
            <button
              className={`flex-1 sm:flex-none px-3 py-1 rounded bg-gray-400 text-gray-100 hover:bg-gray-500 text-xs`}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}