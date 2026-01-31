"use client";

import { useState, useEffect } from "react";
import { WebhookConfigForm } from "@/components/webhooks/config-form";
import { WebhookLogsTable } from "@/components/webhooks/logs-table";

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(
    null,
  );
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEndpoints();
  }, []);

  useEffect(() => {
    if (selectedEndpointId) {
      fetchLogs(selectedEndpointId);
    }
  }, [selectedEndpointId]);

  const fetchEndpoints = async () => {
    try {
      const resp = await fetch("/api/webhooks");
      if (resp.ok) {
        const data = await resp.json();
        setEndpoints(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (id: string) => {
    try {
      const resp = await fetch(`/api/webhooks/${id}/logs`);
      if (resp.ok) {
        setLogs(await resp.json());
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Developer Webhooks</h1>
        <p className="mt-2 text-gray-600">
          Receive real-time notifications about profile views and link clicks on
          your external systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Your Endpoints
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : endpoints.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No webhooks configured.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {endpoints.map((ep) => (
                  <li
                    key={ep.id}
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`py-3 px-2 cursor-pointer rounded hover:bg-gray-50 transition-colors ${selectedEndpointId === ep.id ? "bg-indigo-50 border-l-4 border-indigo-500" : ""}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                        {ep.url}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${ep.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {ep.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setSelectedEndpointId(null)}
            className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Add New Endpoint
          </button>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {selectedEndpointId ? "Edit Endpoint" : "Configure New Webhook"}
            </h2>
            <WebhookConfigForm
              webhookId={selectedEndpointId || undefined}
              onSuccess={() => {
                fetchEndpoints();
                setSelectedEndpointId(null);
              }}
            />
          </div>

          {selectedEndpointId && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Delivery Logs
              </h2>
              <WebhookLogsTable deliveries={logs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
