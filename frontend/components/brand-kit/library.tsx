"use client";

import React, { useState, useEffect } from "react";

interface Asset {
  id: string;
  assetType: string;
  assetUrl: string;
  assetName: string;
  isShared: boolean;
  createdAt: string;
}

interface BrandKitLibraryProps {
  profileId: string;
  canEdit: boolean;
}

export const BrandKitLibrary: React.FC<BrandKitLibraryProps> = ({
  profileId,
  canEdit,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [profileId]);

  const fetchAssets = async () => {
    try {
      const resp = await fetch(`/api/assets?profileId=${profileId}`);
      if (resp.ok) {
        setAssets(await resp.json());
      }
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("profileId", profileId);

    try {
      const resp = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        fetchAssets();
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const resp = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (resp.ok) {
        setAssets(assets.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading)
    return <div className="animate-pulse h-40 bg-muted rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Brand Kit</h3>
          <p className="text-sm text-muted-foreground">
            Shared assets for your team and profile.
          </p>
        </div>
        {canEdit && (
          <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            {isUploading ? "Uploading..." : "Upload Asset"}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="group relative aspect-square rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {asset.assetType.startsWith("image/") ? (
              <img
                src={asset.assetUrl}
                alt={asset.assetName}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground uppercase font-bold">
                {asset.assetName.split(".").pop() || "File"}
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] text-white font-medium truncate w-full mb-2">
                {asset.assetName}
              </span>
              <div className="flex space-x-2">
                <a
                  href={asset.assetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 px-2 bg-white text-black rounded text-[10px] font-bold"
                >
                  View
                </a>
                {canEdit && (
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1 px-2 bg-red-500 text-white rounded text-[10px] font-bold"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl border-muted">
            <p className="text-muted-foreground text-sm">
              No brand assets uploaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
