"use client";

import { useState } from "react";
import { LinkCreateInput } from "../../types";
import { validateLink } from "../../lib/validations";

interface LinkFormProps {
  initialData?: Partial<LinkCreateInput>;
  onSubmit: (data: LinkCreateInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function LinkForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: LinkFormProps) {
  const [formData, setFormData] = useState<LinkCreateInput>({
    title: initialData?.title || "",
    url: initialData?.url || "",
    linkType: initialData?.linkType || "website",
    isVisible: initialData?.isVisible ?? true,
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 16)
      : null,
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 16)
      : null,
    order: initialData?.order || 0,
    // Add other fields as needed
  } as any); // Type assertion for form state handling ease with dates

  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error for this field if it exists
    if (errors.length > 0) setErrors([]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? new Date(value) : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Prepare data for submission
    const submissionData: LinkCreateInput = {
      ...formData,
      // Ensure dates are date objects or null
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    };

    // Validate
    const validation = validateLink(submissionData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit(submissionData);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Failed to save link",
      ]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 mb-6"
    >
      <div className="space-y-6">
        {errors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errors.map((error, idx) => (
                    <span key={idx} className="block">
                      • {error}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Link Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. My Portfolio"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              URL *
            </label>
            <input
              type="url"
              name="url"
              id="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="linkType"
              className="block text-sm font-medium text-gray-700"
            >
              Link Type
            </label>
            <select
              id="linkType"
              name="linkType"
              value={formData.linkType}
              onChange={handleChange}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="website">Website</option>
              <option value="social">Social Media</option>
              <option value="project">Project</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="embed">Embed</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="datetime-local"
              name="startDate"
              id="startDate"
              value={
                formData.startDate
                  ? new Date(formData.startDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleDateChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="datetime-local"
              name="endDate"
              id="endDate"
              value={
                formData.endDate
                  ? new Date(formData.endDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleDateChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2 flex items-center pt-6">
            <input
              id="isVisible"
              name="isVisible"
              type="checkbox"
              checked={formData.isVisible}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isVisible"
              className="ml-2 block text-sm text-gray-900"
            >
              Visible on profile
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Link"}
          </button>
        </div>
      </div>
    </form>
  );
}
