'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectedLinkProps {
  linkId: string;
  title: string;
  destinationUrl: string;
  onUnlock: (url: string) => void;
  onError?: (message: string) => void;
}

export default function PasswordProtectedLink({
  linkId,
  title,
  destinationUrl,
  onUnlock,
  onError,
}: PasswordProtectedLinkProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Verify password with the server
      const response = await fetch(`/api/links/${linkId}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Incorrect password');
      }

      const result = await response.json();

      if (result.valid) {
        // Store session for this link temporarily
        localStorage.setItem(`link_access_${linkId}`, 'true');

        // Call the unlock callback with the destination URL
        onUnlock(destinationUrl);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify password';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user already has access to this link
  if (typeof window !== 'undefined' && localStorage.getItem(`link_access_${linkId}`) === 'true') {
    // User already unlocked this link, redirect directly
    onUnlock(destinationUrl);
    return null;
  }

  if (!showPasswordForm) {
    return (
      <button
        onClick={() => setShowPasswordForm(true)}
        className="w-full flex items-center justify-between p-4 mb-3 text-left rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200"
      >
        <div className="flex items-center">
          <Lock className="mr-3 h-5 w-5 text-gray-400" />
          <div>
            <p className="text-base font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">Password protected link</p>
          </div>
        </div>
        <span className="text-sm text-indigo-600 font-medium">Unlock</span>
      </button>
    );
  }

  return (
    <div className="w-full p-4 mb-3 text-left rounded-lg border border-gray-300 bg-white text-gray-900">
      <div className="flex items-center mb-3">
        <Lock className="mr-2 h-5 w-5 text-gray-400" />
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
      </div>

      {error && (
        <div className="mb-3 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Enter password to access this link
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Password"
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Unlock Link'}
          </button>

          <button
            type="button"
            onClick={() => setShowPasswordForm(false)}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}