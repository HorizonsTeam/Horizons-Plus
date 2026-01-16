function toRadians(deg) {
    return deg * Math.PI / 180;
}

export function haversineDistance(fromLat, fromLon, toLat, toLon) {
    const R = 6371;
    const dLat = toRadians(toLat - fromLat);
    const dLon = toRadians(toLon - fromLon);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(fromLat)) *
        Math.cos(toRadians(toLat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
}