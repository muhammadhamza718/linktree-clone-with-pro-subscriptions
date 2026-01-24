'use client';

import { useState } from 'react';

interface ThemeCustomizerProps {
  initialTheme: any;
  onSave: (themeData: any) => void;
}

export default function ThemeCustomizer({ initialTheme, onSave }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState({
    name: initialTheme?.name || 'My Theme',
    backgroundColor: initialTheme?.backgroundColor || '#ffffff',
    textColor: initialTheme?.textColor || '#1f2937',
    linkColor: initialTheme?.linkColor || '#3b82f6',
    buttonStyle: initialTheme?.buttonStyle || 'rounded',
    buttonColor: initialTheme?.buttonColor || 'solid',
    fontFamily: initialTheme?.fontFamily || 'system-ui',
    fontSize: initialTheme?.fontSize || 'medium',
    isLightMode: initialTheme?.isLightMode ?? true,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      await onSave(theme);
    } catch (error) {
      setErrors(['Failed to save theme']);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Theme Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Customize the appearance of your profile page
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Theme Name */}
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Theme Name
            </label>
            <input
              type="text"
              id="name"
              value={theme.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="My Custom Theme"
            />
          </div>

          {/* Background Color */}
          <div className="sm:col-span-3">
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                id="backgroundColor"
                value={theme.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="h-10 w-10 border-gray-300 rounded"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="ml-3 flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="sm:col-span-3">
            <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">
              Text Color
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                id="textColor"
                value={theme.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="h-10 w-10 border-gray-300 rounded"
              />
              <input
                type="text"
                value={theme.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="ml-3 flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="#1f2937"
              />
            </div>
          </div>

          {/* Link Color */}
          <div className="sm:col-span-3">
            <label htmlFor="linkColor" className="block text-sm font-medium text-gray-700">
              Link Color
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                id="linkColor"
                value={theme.linkColor}
                onChange={(e) => handleChange('linkColor', e.target.value)}
                className="h-10 w-10 border-gray-300 rounded"
              />
              <input
                type="text"
                value={theme.linkColor}
                onChange={(e) => handleChange('linkColor', e.target.value)}
                className="ml-3 flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Button Style */}
          <div className="sm:col-span-3">
            <label htmlFor="buttonStyle" className="block text-sm font-medium text-gray-700">
              Button Style
            </label>
            <select
              id="buttonStyle"
              value={theme.buttonStyle}
              onChange={(e) => handleChange('buttonStyle', e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
              <option value="pill">Pill</option>
            </select>
          </div>

          {/* Button Color */}
          <div className="sm:col-span-3">
            <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700">
              Button Color Style
            </label>
            <select
              id="buttonColor"
              value={theme.buttonColor}
              onChange={(e) => handleChange('buttonColor', e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
              <option value="glass">Glass</option>
            </select>
          </div>

          {/* Font Family */}
          <div className="sm:col-span-3">
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <select
              id="fontFamily"
              value={theme.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="system-ui">System UI</option>
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="sm:col-span-3">
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <select
              id="fontSize"
              value={theme.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Light/Dark Mode */}
          <div className="sm:col-span-6">
            <div className="flex items-center">
              <input
                id="isLightMode"
                type="checkbox"
                checked={theme.isLightMode}
                onChange={(e) => handleChange('isLightMode', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isLightMode" className="ml-2 block text-sm text-gray-900">
                Use Light Mode (uncheck for Dark Mode)
              </label>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Theme
          </button>
        </div>
      </form>
    </div>
  );
}