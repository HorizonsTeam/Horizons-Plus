export function parseJourneySections(journey) {
    const stopsMap = new Map();
    const stops = [];
    const legs = [];

    function addStop(node, dateTime) {
        if (!node) return null;

        const stopPoint = node.stop_point || node;

        // on ignore les stops sans coordonnées
        if (!stopPoint.coord?.lat || !stopPoint.coord?.lon) {
            return null;
        }

        const lat = parseFloat(stopPoint.coord.lat);
        const lng = parseFloat(stopPoint.coord.lon);

        // fusion si même coordonnées (même gare juste quai différent)
        for (const [id, index] of stopsMap.entries()) {
            const existing = stops[index];
            const sameCoords =
                Math.abs(existing.lat - lat) < 0.00001 &&
                Math.abs(existing.lng - lng) < 0.00001;

            if (sameCoords) {
                return index; // on réutilise le stop existant
            }
        }

        // création nouveau stop
        const id = stopPoint.id;
        const city =
            stopPoint.administrative_regions?.[0]?.name ||
            stopPoint.name;

        const placeName = stopPoint.label || stopPoint.name;

        const stop = {
            id,
            kind: "station", // Faudra ajouter airport si c'est amadeus
            city,
            placeName,
            arrival: dateTime
                ? dateTime.slice(9, 13).replace(/(\d{2})(\d{2})/, "$1:$2")
                : null,
            lat,
            lng
        };
        
        stopsMap.set(id, stops.length);
        stops.push(stop);

        return stops.length - 1;
    }

    function getMode(section) {
        console.log(section.id, " = ", section.type);
        if (section.type === "public_transport") {
            return "rail";
            // Faudra ajouter "air" pour l'avion c'est amadeus
        }
        if (section.type === "transfer" || section.type === "crow_fly") return "walking";
        if (section.type === "boarding") return;
        return "unknown";
    }

    function isMeaningfulWalking(section) {
        if (section.type !== "transfer") return false;

        const coords = section.geojson?.properties?.[0]?.length || 0;

        // Si distance = 0 → inutile
        if (coords < 1) return false;

        return true;
    }

    let lastValidStopIndex = null;

    journey.sections.forEach((section) => {
        if (section.type === "waiting") { 
            if (lastValidStopIndex !== null) { 
                legs.push({ 
                    fromIndex: lastValidStopIndex, 
                    toIndex: lastValidStopIndex, 
                    mode: "waiting" 
                }); 
            } return; 
        }

        if (section.type === "transfer") {
            if (!isMeaningfulWalking(section)) {
                return;
            }
        }

        const fromIndex = addStop(section.from, section.departure_date_time);
        const toIndex = addStop(section.to, section.arrival_date_time);

        if (fromIndex !== null && toIndex !== null) {
            legs.push({
                fromIndex,
                toIndex,
                mode: getMode(section)
            });

            lastValidStopIndex = toIndex;
        }
    });

    const cleanedLegs = legs.filter(leg => !!leg.mode);

    return { stops, legs: cleanedLegs };
}