import sql from '../../db.js';
import { toPgTimestamp } from '../utils/utils.js';

export async function findActivePanierByUserId(userId) {
    return await sql`
        SELECT * FROM panier WHERE user_id = ${userId} AND statut = 'ACTIF'
    `;
}

export async function findActivePanierBySessionId(sessionId) {
    return await sql`
        SELECT * FROM panier WHERE session_id = ${sessionId} AND statut = 'ACTIF'
    `;
}

export async function createPanier(userId, sessionId) {
    return await sql`
        INSERT INTO panier (user_id, session_id, cree_le, expire_le, statut)
        VALUES (${userId}, ${sessionId}, NOW(), NOW() + INTERVAL '1 hour', 'ACTIF')
        RETURNING *
    `;
}

export async function createPassager(passagerData) {
    return await sql`
        INSERT INTO passager (panier_id, nom, email)
        VALUES (
            ${passagerData.panier_id},
            ${passagerData.name},
            ${passagerData.email}
        )
        RETURNING *;
    `;
}

export async function findPassagerByUserId(userId) {
    return await sql`
        SELECT * 
        FROM passager 
        WHERE user_id = ${userId} 
        LIMIT 1
    `
}

export async function findPassagerByPanierId(panierId) {
    return await sql`
        SELECT * 
        FROM passager 
        WHERE panier_id = ${panierId} 
        LIMIT 1
    `;
}


export async function insertPanierItem(panierId, passagerId, billetData) {
    const departHeure = toPgTimestamp(billetData.departHeure);
    const arriveeHeure = toPgTimestamp(billetData.arriveeHeure);

    return await sql`
        INSERT INTO panier_item (
            panier_id, passager_id, depart_heure, depart_lieu, arrivee_heure, arrivee_lieu,
            classe, siege_restant, prix, ajoute_le, date_voyage, transport_type
        )
        VALUES (
            ${panierId}, ${passagerId}, ${departHeure}, ${billetData.departLieu},
            ${arriveeHeure}, ${billetData.arriveeLieu},
            ${billetData.classe}, ${billetData.siegeRestant},
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

export async function deletePanierItem(panierId, itemId) {
    return await sql`
        DELETE FROM panier_item WHERE panier_id = ${panierId} AND panier_item_id = ${itemId}
    `
}

export async function checkPanierItemDoublon(panierId, billetData) {
    const result = await sql`
        SELECT 1
        FROM panier_item
        WHERE panier_id = ${panierId}
            AND date_voyage = ${billetData.dateVoyage}
            AND depart_lieu = ${billetData.departLieu}
            AND arrivee_lieu = ${billetData.arriveeLieu}
            AND transport_type = ${billetData.transportType}
            AND classe = ${billetData.classe}
        LIMIT 1
    `;

    return result.length > 0;
}
