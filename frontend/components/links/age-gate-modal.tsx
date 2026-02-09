"use client";

import { useState } from "react";

interface AgeGateModalProps {
  linkId: string;
  title: string;
  destinationUrl: string;
  onConfirm: (url: string) => void;
  onCancel: () => void;
}

export default function AgeGateModal({
  linkId,
  title,
  destinationUrl,
  onConfirm,
  onCancel,
}: AgeGateModalProps) {
  const [showModal, setShowModal] = useState(true);
  const [birthYear, setBirthYear] = useState<number | "">("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    setError("");

    if (!birthYear) {
      setError("Please enter your birth year");
      return;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - Number(birthYear);

    if (age < 18) {
      setError("You must be 18 years or older to access this content");
      return;
    }

    // Store age verification in localStorage for this session
    localStorage.setItem(`age_verified_${linkId}`, "true");

    // Close modal and navigate to destination
    setShowModal(false);
    onConfirm(destinationUrl);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onCancel}
        />

        {/* Modal container */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Age Verification Required
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You must be 18 years or older to access "{title}".
                  </p>

                  <div className="mt-4">
                    <label
                      htmlFor="birth-year"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter your birth year
                    </label>
                    <input
                      type="number"
                      id="birth-year"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={birthYear}
                      onChange={(e) =>
                        setBirthYear(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., 1990"
                    />

                    {error && (
                      <p className="mt-2 text-sm text-red-600" role="alert">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirm Age
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
