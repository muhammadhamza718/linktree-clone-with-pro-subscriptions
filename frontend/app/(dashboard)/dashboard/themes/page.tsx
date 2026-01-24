'use client';

import { useState, useEffect } from 'react';
import ThemeCustomizer from '../../../../components/profile/theme-customizer';

export default function ThemesPage() {
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load current theme
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch('/api/themes/current');
        if (!response.ok) throw new Error('Failed to fetch theme');

        const data = await response.json();
        setTheme(data.theme || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load theme');
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  const handleSaveTheme = async (themeData: any) => {
    try {
      const response = await fetch('/api/themes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData),
      });

      if (!response.ok) {
        throw new Error('Failed to save theme');
      }

      const result = await response.json();
      setTheme(result.theme);
      alert('Theme saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save theme');
    }
  };

  if (loading) return <div className="p-4">Loading theme settings...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customize Your Profile Theme</h1>
        <p className="mt-2 text-gray-600">
          Choose from predefined themes or create your own custom look.
        </p>
      </div>

      <ThemeCustomizer
        initialTheme={theme}
        onSave={handleSaveTheme}
      />
    </div>
  );
}