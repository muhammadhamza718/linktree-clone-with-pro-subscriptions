"use client";

import React from "react";

interface LinkCardProps {
  link: {
    id: string;
    title: string;
    url: string;
    linkType?: string;
    thumbnail?: string;
    icon?: string;
    variantId?: string;
    profileId: string;
  };
}

export default function LinkCard({ link }: LinkCardProps) {
  const getLinkIcon = (type: string) => {
    switch (type) {
      case "social":
        return "🔗";
      case "email":
        return "📧";
      case "phone":
        return "📞";
      case "project":
        return "📂";
      default:
        return "🌐";
    }
  };

  const handleLinkClick = async () => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: link.profileId,
          linkId: link.id,
          variantId: link.variantId,
          eventType: "link_click",
        }),
      });
    } catch (error) {
      console.error("Failed to track link click:", error);
    }
  };

  const isExternalLink = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <a
      href={link.url}
      onClick={handleLinkClick}
      target={isExternalLink(link.url) ? "_blank" : undefined}
      rel={isExternalLink(link.url) ? "noopener noreferrer" : undefined}
      className="block w-full p-4 mb-3 text-left rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-indigo-400 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center">
        <span className="mr-3 text-xl" aria-label={`${link.linkType} link`}>
          {getLinkIcon(link.linkType || "website")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium truncate">{link.title}</p>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>
      </div>
    </a>
  );
}
