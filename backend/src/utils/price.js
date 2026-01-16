import { randInt } from "./random.js";

export function calculerPrixFictif(distanceM, nbTransfers, trainType) { // pour journey SNCF
    const distanceKm = distanceM / 1000;
    const base = 5;
    const coeffDistance = 0.05;
    const coeffTransfert = 4;
    const coeffType = {
        "TER / Intercités": 1,
        "Train grande vitesse": 2,
    };

    let prix =
        base +
        distanceKm * coeffDistance +
        nbTransfers * coeffTransfert +
        (coeffType[trainType] || 1) * 5;

    return (Math.ceil(prix * 10) / 10).toFixed(2);
}

export function calculateSimulatedPrice(distanceKm) { // pour generation fictive Amadeus
    return (distanceKm * 0.12 + randInt(-30, 30)).toFixed(2);
}
