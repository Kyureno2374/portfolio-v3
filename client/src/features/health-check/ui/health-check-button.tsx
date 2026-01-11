"use client";

import { useState } from "react";
import { Button } from "@/shared/ui";
import { apiClient } from "@/shared/api";

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function HealthCheckButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<HealthResponse>("/health");
      setStatus(`Server is ${data.status}`);
    } catch {
      setStatus("Server is unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={checkHealth} disabled={loading}>
        {loading ? "Checking..." : "Check Server Health"}
      </Button>
      {status && (
        <p className="text-sm text-gray-600">{status}</p>
      )}
    </div>
  );
}
