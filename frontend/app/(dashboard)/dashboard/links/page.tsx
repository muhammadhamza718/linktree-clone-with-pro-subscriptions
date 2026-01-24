'use client';

import { useState, useEffect } from 'react';
import { validateLink } from '../../../../lib/validations';
import LinkManager from '../../../../components/profile/link-manager';

export default function LinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/links');
        if (!response.ok) throw new Error('Failed to fetch links');

        const data = await response.json();
        setLinks(data.links || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load links');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) return <div className="p-4">Loading links...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Your Links</h1>
        <p className="mt-2 text-gray-600">
          Add, edit, and organize the links you want to share on your profile.
        </p>
      </div>

      <LinkManager
        initialLinks={links}
        onUpdateLinks={setLinks}
      />
    </div>
  );
}