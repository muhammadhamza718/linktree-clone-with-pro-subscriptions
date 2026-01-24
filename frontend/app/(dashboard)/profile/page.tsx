'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileEditor from '../../../components/profile/profile-editor';

export default function ProfileSetupPage() {
  const [profileData, setProfileData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
    title: '',
    avatarLayout: 'classic' as const,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if username is available
  useEffect(() => {
    if (profileData.username.length >= 3) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch('/api/profile/username-available', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: profileData.username }),
          });

          const data = await response.json();
          setUsernameAvailable(data.available);
        } catch (error) {
          setUsernameAvailable(null);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [profileData.username]);

  const handleSaveProfile = async (data: any) => {
    setIsLoading(true);
    setErrors([]);

    try {
      // Create profile
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Profile created successfully, redirect to dashboard
        router.push('/dashboard');
      } else {
        setErrors([result.message || 'Failed to create profile']);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Set up your profile</h1>
        <p className="mt-2 text-gray-600">
          Customize your profile to showcase your work and connect with others.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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

      <ProfileEditor
        initialProfile={profileData}
        onSave={handleSaveProfile}
        onCancel={handleCancel}
      />
    </div>
  );
}