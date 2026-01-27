'use client';

import { useState, useEffect } from 'react';
import { validateCSS } from '../../lib/validations';

interface CustomCSSEditorProps {
  initialCSS?: string;
  profileId: string;
  onSave: (cssCode: string) => void;
  onCancel: () => void;
}

export default function CustomCSSEditor({ initialCSS = '', profileId, onSave, onCancel }: CustomCSSEditorProps) {
  const [cssCode, setCssCode] = useState(initialCSS);
  const [previewCSS, setPreviewCSS] = useState(initialCSS);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateCSSInput = async () => {
    setIsValidating(true);
    setErrors([]);

    try {
      const validationResult = validateCSS(cssCode);
      if (!validationResult.isValid) {
        setErrors(validationResult.errors);
      }
    } catch (error) {
      setErrors(['CSS validation failed']);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateCSSInput();
  }, [cssCode]);

  const handleSave = async () => {
    if (errors.length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      // In a real implementation, this would call an API
      await onSave(cssCode);
    } catch (error) {
      setErrors([(error as Error).message || 'Failed to save CSS']);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Custom CSS Editor</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
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

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="cssCode" className="block text-sm font-medium text-gray-700">
            Custom CSS
          </label>
          <div className="mt-1">
            <textarea
              id="cssCode"
              rows={15}
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              className="font-mono block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="/* Add your custom CSS here */&#10;.profile-container {&#10;  background-color: #f3f4f6;&#10;}&#10;&#10;.link-button {&#10;  border-radius: 8px;&#10;  transition: all 0.2s ease;&#10;}"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Add custom CSS to personalize your profile appearance. Security is validated to prevent harmful properties.
          </p>
        </div>

        <div className="sm:col-span-2">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Security Validation</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Dangerous CSS properties are blocked (e.g., expressions, behaviors)</li>
              <li>• External resource inclusion is restricted</li>
              <li>• JavaScript injection is prevented</li>
              <li>• Only safe styling properties are allowed</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isValidating || errors.length > 0}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save CSS'}
        </button>
      </div>
    </div>
  );
}