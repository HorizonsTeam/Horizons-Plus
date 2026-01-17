export function analyzeJourney(journey) {
    const transportSections = journey.sections.filter(
        (section) => section.type === "public_transport"
    );
    return transportSections.length - 1 < 0 ? 0 : transportSections.length - 1;
}

export function computeJourneyDistanceMeters(journey) {
    return journey.sections.reduce((total, section) => {
        // On ne prend que les sections qui ont un geojson avec des propriétés
        if (section.geojson?.properties) {
        const sumSection = section.geojson.properties.reduce(
            (sum, prop) => sum + (prop.length || 0),
            0
        );
        return total + sumSection;
        }
        return total;
    }, 0);
}