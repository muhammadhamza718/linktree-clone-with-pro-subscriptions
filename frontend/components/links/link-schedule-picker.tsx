"use client";

import { useState, useEffect } from "react";

interface LinkSchedulePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  timezone: string | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onTimezoneChange: (timezone: string) => void;
}

export default function LinkSchedulePicker({
  startDate,
  endDate,
  timezone,
  onStartDateChange,
  onEndDateChange,
  onTimezoneChange,
}: LinkSchedulePickerProps) {
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);

  // Load available timezones on component mount
  useEffect(() => {
    // In a real implementation, we would fetch timezones from the Intl API or a service
    // For now, we'll use a predefined list of common timezones
    const commonTimezones = [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Kolkata",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];
    setAvailableTimezones(commonTimezones);
  }, []);

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (date: Date | undefined) => void,
  ) => {
    if (!e.target.value) {
      callback(undefined);
      return;
    }
    callback(new Date(e.target.value));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date Picker */}
        <div>
          <label
            htmlFor="schedule-start-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date (Optional)
          </label>
          <input
            type="datetime-local"
            id="schedule-start-date"
            value={formatDateForInput(startDate)}
            onChange={(e) => handleDateChange(e, onStartDateChange)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* End Date Picker */}
        <div>
          <label
            htmlFor="schedule-end-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date (Optional)
          </label>
          <input
            type="datetime-local"
            id="schedule-end-date"
            value={formatDateForInput(endDate)}
            onChange={(e) => handleDateChange(e, onEndDateChange)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Timezone Selector */}
      <div>
        <label
          htmlFor="schedule-timezone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Timezone
        </label>
        <select
          id="schedule-timezone"
          value={timezone || ""}
          onChange={(e) => onTimezoneChange(e.target.value)}
          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>
            Select timezone
          </option>
          {availableTimezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Timezone affects when your scheduled links become active/inactive
        </p>
      </div>
    </div>
  );
}
