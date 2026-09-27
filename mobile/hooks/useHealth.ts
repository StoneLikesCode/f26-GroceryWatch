import { useEffect, useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type HealthState =
  | { kind: "checking"; label: string }
  | { kind: "ok"; label: string }
  | { kind: "error"; label: string };

export function useHealth(): HealthState {
  const [health, setHealth] = useState<HealthState>({
    kind: "checking",
    label: "Checking API...",
  });

  useEffect(() => {
    if (!API_URL) {
      setHealth({ kind: "error", label: "API URL not set" });
      return;
    }

    let cancelled = false;

    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.status === "ok") {
          setHealth({
            kind: "ok",
            label: `API: ${data.status}, DB: ${data.db}`,
          });
        } else {
          setHealth({
            kind: "error",
            label: `API: ${data?.status ?? "error"}, DB: ${data?.db ?? "unreachable"}`,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHealth({ kind: "error", label: "API unreachable" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return health;
}
