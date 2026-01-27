'use client';

import { useState, useEffect } from 'react';

interface EmbeddedContentProps {
  content: string;
  contentType: 'youtube' | 'spotify' | 'instagram' | 'twitter' | 'custom-embed';
  title?: string;
  className?: string;
}

export default function EmbeddedContent({ content, contentType, title, className = '' }: EmbeddedContentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Sanitize the embed URL to extract just the ID or valid URL
  const sanitizeEmbedUrl = (url: string): string => {
    try {
      // For YouTube
      if (contentType === 'youtube') {
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(youtubeRegex);
        if (match) {
          return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url; // If already in embed format
      }

      // For Spotify
      if (contentType === 'spotify') {
        const spotifyRegex = /(spotify\.com\/(track|album|playlist)\/([^?&\n\r]+))/;
        const match = url.match(spotifyRegex);
        if (match) {
          // Extract the path and convert to embed URL
          const embedPath = match[0].replace('open.spotify.com/', 'open.spotify.com/embed/');
          return `https://${embedPath}`;
        }
        return url; // If already in embed format
      }

      return url;
    } catch (error) {
      console.error('Error sanitizing embed URL:', error);
      return url;
    }
  };

  // Determine the embed URL based on content type
  const getEmbedUrl = (): string => {
    if (contentType === 'youtube' || contentType === 'spotify') {
      return sanitizeEmbedUrl(content);
    }
    // For custom embeds, assume content is already the embed code
    return content;
  };

  const embedUrl = getEmbedUrl();

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsError(true);
  };

  // If content type is custom embed, render as-is with security
  if (contentType === 'custom-embed') {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <div className="aspect-w-16 aspect-h-9">
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
      )}

      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        {!isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">Loading {contentType}...</div>
          </div>
        )}

        {isError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-red-500 text-center p-4">
              <p>Failed to load content</p>
              <p className="text-xs mt-1">URL: {content.substring(0, 50)}...</p>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title={title || `${contentType} embed`}
          />
        )}
      </div>
    </div>
  );
}