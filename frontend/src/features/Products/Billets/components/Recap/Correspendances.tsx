import "leaflet/dist/leaflet.css";

import { useEffect, useMemo } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    Popup,
    useMap,
    Tooltip,
} from "react-leaflet";
import L, { LatLngBounds } from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix icônes Leaflet (utile selon bundler)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/** =======================
 *  Types
 *  ======================= */

export type StopKind = "station" | "airport";

export type Stop = {
    id?: string; // optionnel (clé stable)
    kind?: StopKind; // station / airport (optionnel, utile pour UI)
    city: string;
    placeName: string; // nom de gare OU aéroport
    arrival?: string; // optionnel (pour vol tu peux ne pas mettre)
    lat: number;
    lng: number;
};

export type LegMode = "rail" | "air";

export type Leg = {
    fromIndex: number; // index dans stops
    toIndex: number; // index dans stops
    mode: LegMode;
};

export type RouteMapProps = {
    stops: Stop[];
    legs: Leg[];
    className?: string;
    onStopClick?: (stop: Stop, index: number) => void;
};

/** =======================
 *  FitBounds
 *  ======================= */

type FitBoundsProps = {
    bounds: LatLngBounds | null;
    padding?: [number, number];
};

function FitBounds({ bounds, padding = [40, 40] }: FitBoundsProps) {
    const map = useMap();

    useEffect(() => {
        if (!bounds) return;
        map.fitBounds(bounds, { padding });
    }, [bounds, map, padding]);

    return null;
}

/** =======================
 *  Utils: Great-circle curve for flights
 *  (creates a curved polyline between 2 points)
 *  ======================= */

function toRad(deg: number) {
    return (deg * Math.PI) / 180;
}
function toDeg(rad: number) {
    return (rad * 180) / Math.PI;
}

/**
 * Interpolation on a sphere (great-circle)
 * Returns array of [lat,lng] points.
 */
function greatCirclePoints(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    steps = 80
): [number, number][] {
    const lat1 = toRad(from.lat);
    const lon1 = toRad(from.lng);
    const lat2 = toRad(to.lat);
    const lon2 = toRad(to.lng);

    // Convert to 3D unit vectors
    const a = {
        x: Math.cos(lat1) * Math.cos(lon1),
        y: Math.cos(lat1) * Math.sin(lon1),
        z: Math.sin(lat1),
    };
    const b = {
        x: Math.cos(lat2) * Math.cos(lon2),
        y: Math.cos(lat2) * Math.sin(lon2),
        z: Math.sin(lat2),
    };

    // Angle between a and b
    const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
    const omega = Math.acos(dot);

    // If points are extremely close, fallback to straight
    if (omega < 1e-6) {
        return [
            [from.lat, from.lng],
            [to.lat, to.lng],
        ];
    }

    const sinOmega = Math.sin(omega);

    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const s1 = Math.sin((1 - t) * omega) / sinOmega;
        const s2 = Math.sin(t * omega) / sinOmega;

        const x = s1 * a.x + s2 * b.x;
        const y = s1 * a.y + s2 * b.y;
        const z = s1 * a.z + s2 * b.z;

        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lng = Math.atan2(y, x);

        pts.push([toDeg(lat), toDeg(lng)]);
    }

    return pts;
}

/** =======================
 *  Component
 *  ======================= */

function RouteMap(props: RouteMapProps) {
    const { stops, legs, className, onStopClick } = props;

    const bounds = useMemo(() => {
        if (!stops || stops.length < 2) return null;
        const latlngs = stops.map((s) => L.latLng(s.lat, s.lng));
        return L.latLngBounds(latlngs);
    }, [stops]);

    const center = useMemo(() => {
        if (!stops?.length) return [46.5, 2.5] as [number, number];
        return [stops[0].lat, stops[0].lng] as [number, number];
    }, [stops]);

    const railPolylines = useMemo(() => {
        const out: [number, number][][] = [];
        for (const leg of legs) {
            if (leg.mode !== "rail") continue;
            const a = stops[leg.fromIndex];
            const b = stops[leg.toIndex];
            if (!a || !b) continue;
            out.push([
                [a.lat, a.lng],
                [b.lat, b.lng],
            ]);
        }
        return out;
    }, [legs, stops]);

    const airPolylines = useMemo(() => {
        const out: [number, number][][] = [];
        for (const leg of legs) {
            if (leg.mode !== "air") continue;
            const a = stops[leg.fromIndex];
            const b = stops[leg.toIndex];
            if (!a || !b) continue;
            out.push(greatCirclePoints({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng }, 90));
        }
        return out;
    }, [legs, stops]);

    if (!stops || stops.length < 2) {
        return (
            <div style={{ padding: 16, borderRadius: 16, background: "#0b1220", color: "white" }}>
                Il faut au moins 2 points dans <code>stops</code>.
            </div>
        );
    }

    return (
        <div style={{ width: "100%", margin: "" }} className={`relative z-0 ${className ?? ""}`}>
            <div style={{ borderRadius: 18 }} className="relative z-0 overflow-hidden h-120 w-full">
                <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
                    <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <FitBounds bounds={bounds} />

                    {/* RAIL: segments droits */}
                    {railPolylines.map((line, idx) => (
                        <Polyline
                            key={`rail-${idx}`}
                            positions={line}
                            pathOptions={{
                                weight: 6,
                                opacity: 0.9,
                                lineCap: "round",
                                lineJoin: "round",
                            }}
                        />
                    ))}

                    {/* AIR: segments courbés + pointillés */}
                    {airPolylines.map((curve, idx) => (
                        <Polyline
                            key={`air-${idx}`}
                            positions={curve}
                            pathOptions={{
                                weight: 4,
                                opacity: 0.95,
                                lineCap: "round",
                                lineJoin: "round",
                                dashArray: "7 12", // pointillés = vol
                            }}
                        />
                    ))}

                    {/* Markers + labels */}
                    {stops.map((s, idx) => (
                        <Marker
                            key={s.id || `${s.placeName}-${idx}`}
                            position={[s.lat, s.lng]}
                            eventHandlers={
                                onStopClick
                                    ? {
                                        click: () => onStopClick(s, idx),
                                    }
                                    : undefined
                            }
                        >
                            {/* Heure affichée seulement si arrivée fournie */}
                            {s.arrival ? (
                                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                                    <div style={{ fontFamily: "system-ui", fontWeight: 700 }}>{s.arrival}</div>
                                </Tooltip>
                            ) : null}

                            <Popup>
                                <div style={{ fontFamily: "system-ui", minWidth: 220 }}>
                                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{s.placeName}</div>
                                    <div style={{ opacity: 0.8 }}>{s.city}</div>
                                    {s.kind ? <div style={{ marginTop: 8, opacity: 0.75 }}>Type : <b>{s.kind}</b></div> : null}
                                    {s.arrival ? (
                                        <div style={{ marginTop: 10 }}>
                                            Arrivée : <b>{s.arrival}</b>
                                        </div>
                                    ) : null}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

type CorrespendancesProps = 
{
    stops: Stop[];
    legs: Leg[];

}

export default function Correspendances({ stops, legs }: CorrespendancesProps) {
    

    return (
        <div className=" max-h-screen overflow-hidden">
            <RouteMap stops={stops} legs={legs}  className=""/>
        </div>
    );
}
