"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface WebhookConfigFormProps {
  webhookId?: string;
  onSuccess?: () => void;
}

const EVENT_TYPES = [
  { id: "profile_view", label: "Profile View" },
  { id: "link_click", label: "Link Click" },
  { id: "form_submission", label: "Form Submission" },
  { id: "profile_updated", label: "Profile Updated" },
];

export const WebhookConfigForm: React.FC<WebhookConfigFormProps> = ({
  webhookId,
  onSuccess,
}) => {
  const router = useRouter();
  const [form, setForm] = useState({
    url: "",
    events: [] as string[],
    secret: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (webhookId) {
      fetchWebhook();
    }
  }, [webhookId]);

  const fetchWebhook = async () => {
    try {
      const resp = await fetch(`/api/webhooks/${webhookId}`);
      if (!resp.ok) throw new Error("Failed to fetch webhook");
      const data = await resp.json();
      setForm({
        url: data.url,
        events: JSON.parse(data.events),
        secret: data.secret,
        isActive: data.isActive,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const method = webhookId ? "PATCH" : "POST";
    const endpoint = webhookId ? `/api/webhooks/${webhookId}` : "/api/webhooks";

    try {
      const resp = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Failed to save webhook");
      }

      if (onSuccess) onSuccess();
      if (!webhookId) {
        setForm({ url: "", events: [], secret: "", isActive: true });
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventToggle = (eventId: string) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  const generateSecret = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, secret: result }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-card p-6 rounded-xl border shadow-sm"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Webhook URL
        </label>
        <input
          type="url"
          required
          placeholder="https://your-api.com/webhooks"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Trigger Events</label>
        <div className="grid grid-cols-2 gap-3">
          {EVENT_TYPES.map((event) => (
            <div key={event.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`event-${event.id}`}
                checked={form.events.includes(event.id)}
                onChange={() => handleEventToggle(event.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor={`event-${event.id}`}
                className="text-sm cursor-pointer"
              >
                {event.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">
            Webhook Secret (HMAC Signature)
          </label>
          <button
            type="button"
            onClick={generateSecret}
            className="text-xs text-primary hover:underline"
          >
            Generate New
          </button>
        </div>
        <input
          type="text"
          required
          placeholder="your-signing-secret"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.secret}
          onChange={(e) => setForm({ ...form, secret: e.target.value })}
        />
        <p className="text-[10px] text-muted-foreground">
          Linktree will sign payloads using this secret and provide the
          signature in the <code>X-Linktree-Signature</code> header.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is-active"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label
          htmlFor="is-active"
          className="text-sm font-medium cursor-pointer"
        >
          Enable Webhook
        </label>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        {isLoading
          ? "Saving..."
          : webhookId
            ? "Update Webhook"
            : "Create Webhook"}
      </button>
    </form>
  );
};
