"use client";

import React from "react";

interface DeliveryLog {
  id: string;
  payload: any;
  statusCode: number | null;
  response: string | null;
  attemptCount: number;
  status: string;
  deliveredAt: string | null;
  createdAt: string;
}

interface WebhookLogsTableProps {
  deliveries: DeliveryLog[];
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({
  deliveries,
}) => {
  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="text-center py-10 border rounded-xl bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No delivery logs found yet.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string, code: number | null) => {
    if (status === "success")
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (status === "pending")
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const formatPayload = (payload: any) => {
    try {
      return typeof payload === "string"
        ? payload
        : JSON.stringify(payload, null, 2);
    } catch {
      return "Invalid payload structure";
    }
  };

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Attempts</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {deliveries.map((delivery) => (
              <React.Fragment key={delivery.id}>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(delivery.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {delivery.payload?.event || "unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(delivery.status, delivery.statusCode)}`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{delivery.statusCode || "---"}</td>
                  <td className="px-4 py-3 text-center">
                    {delivery.attemptCount}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-primary hover:underline"
                      onClick={() => {
                        const el = document.getElementById(
                          `details-${delivery.id}`,
                        );
                        if (el) el.classList.toggle("hidden");
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
                <tr
                  id={`details-${delivery.id}`}
                  className="hidden bg-muted/20"
                >
                  <td colSpan={6} className="px-4 py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">
                          Payload
                        </label>
                        <pre className="p-3 rounded bg-zinc-950 text-zinc-300 text-[10px] overflow-auto max-h-40 leading-tight">
                          {formatPayload(delivery.payload)}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">
                          Response Body
                        </label>
                        <pre className="p-3 rounded bg-zinc-950 text-zinc-300 text-[10px] overflow-auto max-h-40 leading-tight">
                          {delivery.response || "No response body"}
                        </pre>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
