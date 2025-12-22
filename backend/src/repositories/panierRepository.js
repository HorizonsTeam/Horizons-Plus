import sql from '../../db.js';

export async function findActivePanierByUser(userId) {
    return await sql`
        SELECT * FROM panier WHERE user_id = ${userId} AND statut = 'ACTIF'
    `;
}

export async function createPanier(userId, sessionId = null) {
    return await sql`
        INSERT INTO panier (user_id, session_id, cree_le, expire_le, statut)
        VALUES (${userId}, ${sessionId}, NOW(), NOW() + INTERVAL '1 day', 'ACTIF')
        RETURNING *
    `;
}

export async function findPassager(userId) {
    return await sql`
        SELECT passager_id FROM passager WHERE user_id = ${userId}
    `;
}

export async function insertPanierItem(panierId, passagerId, billetData) {
    console.log("FINAL SQL VALUES:", {
        depart_heure: billetData.departHeure,
        arrivee_heure: billetData.arriveeHeure,
        date_voyage: billetData.dateVoyage
    });

    return await sql`
        INSERT INTO panier_item (
            panier_id, passager_id, depart_heure, depart_lieu, arrivee_heure, arrivee_lieu,
            classe, siege_label, prix, ajoute_le, date_voyage, transport_type
        )
        VALUES (
            ${panierId}, ${passagerId}, ${billetData.departHeure}, ${billetData.departLieu},
            ${billetData.arriveeHeure}, ${billetData.arriveeLieu},
            ${billetData.classe}, ${billetData.siegeLabel},
            ${billetData.prix}, NOW(), ${billetData.dateVoyage},
            ${billetData.transportType}
        )
        RETURNING *
    `;
}

export async function getPanierItems(panierId) {
    return await sql`
        SELECT * FROM panier_item WHERE panier_id = ${panierId}
    `;
}