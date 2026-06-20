import { useEffect, useState } from "react";
import type { GeolocStatus } from "./types";

export type GeolocResult = {
  status: GeolocStatus;
  coords: { lat: number; lon: number } | null;
};

export function useGeolocation(): GeolocResult {
  const [state, setState] = useState<GeolocResult>({ status: "idle", coords: null });

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "error", coords: null });
      return;
    }

    setState({ status: "loading", coords: null });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "granted",
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        });
      },
      (err) => {
        setState({
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error",
          coords: null,
        });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 }
    );
  }, []);

  return state;
}
