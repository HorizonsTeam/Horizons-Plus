import { randInt } from "./random.js";

export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

export function minutesToHHMM(totalMinutes) {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function randomDepartureTime() {
    const hour = randInt(7, 8);
    const minute = randInt(0, 59);
    return hour * 60 + minute;
}