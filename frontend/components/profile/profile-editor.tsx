"use client";

import { useState } from "react";
import { validateProfile, isValidImageUrl } from "../../lib/validations";
import { Profile, ProfileUpdateInput } from "../../types";

interface ProfileEditorProps {
  initialProfile?: Partial<Profile>;
  onSave: (profileData: ProfileUpdateInput) => Promise<void> | void;
  onCancel: () => void;
}

export default function ProfileEditor({
  initialProfile,
  onSave,
  onCancel,
}: ProfileEditorProps) {
  const [username, setUsername] = useState(initialProfile?.username || "");
  const [displayName, setDisplayName] = useState(
    initialProfile?.displayName || "",
  );
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [avatar, setAvatar] = useState(initialProfile?.avatar || "");
  const [title, setTitle] = useState(initialProfile?.title || "");
  const [avatarLayout, setAvatarLayout] = useState<"classic" | "hero">(
    initialProfile?.avatarLayout || "classic",
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    initialProfile?.avatar || "",
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setAvatar(result); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validate profile data
    const profileData: ProfileUpdateInput = {
      username,
      displayName,
      bio,
      avatar,
      avatarLayout,
      title,
    };

    const validation = validateProfile(profileData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    // If avatar is a file input, we'll need to process it separately
    // For now, we'll validate that it's a valid image URL or base64
    if (avatar && !isValidImageUrl(avatar)) {
      setErrors(["Avatar must be a valid image URL or uploaded image"]);
      setIsLoading(false);
      return;
    }

    try {
      await onSave(profileData);
    } catch (error) {
      setErrors(["Failed to save profile"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
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

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Username */}
        <div className="sm:col-span-3">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username *
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              yourdomain.com/
            </span>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="username"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            3-30 characters, letters, numbers, and hyphens only
          </p>
        </div>

        {/* Display Name */}
        <div className="sm:col-span-3">
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            Display Name *
          </label>
          <input
            type="text"
            id="displayName"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Your name"
          />
        </div>

        {/* Title */}
        <div className="sm:col-span-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. Full-Stack Developer"
          />
        </div>

        {/* Avatar Layout */}
        <div className="sm:col-span-2">
          <label
            htmlFor="avatarLayout"
            className="block text-sm font-medium text-gray-700"
          >
            Avatar Layout
          </label>
          <select
            id="avatarLayout"
            value={avatarLayout}
            onChange={(e) =>
              setAvatarLayout(e.target.value as "classic" | "hero")
            }
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="classic">Classic (Centered)</option>
            <option value="hero">Hero Banner</option>
          </select>
        </div>

        {/* Bio */}
        <div className="sm:col-span-6">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={280}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tell people about yourself..."
          />
          <p className="mt-2 text-xs text-gray-500">
            {bio.length}/280 characters
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Avatar
          </label>

          {/* Preview image if available */}
          {imagePreview && (
            <div className="mt-2 flex items-center">
              <img
                src={imagePreview}
                alt="Avatar preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          )}

          <div className="mt-2 flex items-center space-x-4">
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>

            <span className="text-sm text-gray-500">or</span>

            <input
              type="text"
              value={avatar}
              onChange={(e) => {
                setAvatar(e.target.value);
                setImagePreview(e.target.value); // Update preview with URL
              }}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Or enter image URL"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Upload a JPG, PNG, or GIF file (max 5MB) or provide an image URL
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
