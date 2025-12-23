import sql from '../../db.js';
import { toPgTimestamp } from '../utils/timestamp.js';

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

export async function createPassager(passagerData) {
    return await sql`
        INSERT INTO passager (user_id, prenom, nom, email, is_primary)
        VALUES (
            ${passagerData.user_id},
            ${passagerData.prenom || ""},
            ${passagerData.name},
            ${passagerData.email},
            ${passagerData.is_primary}
        )
        RETURNING *;
    `;
}


export async function findPassager(userId) {
    return await sql`
        SELECT passager_id FROM passager WHERE user_id = ${userId}
    `;
}

export async function insertPanierItem(panierId, passagerId, billetData) {
    const departHeure = toPgTimestamp(billetData.departHeure);
    const arriveeHeure = toPgTimestamp(billetData.arriveeHeure);

    return await sql`
        INSERT INTO panier_item (
            panier_id, passager_id, depart_heure, depart_lieu, arrivee_heure, arrivee_lieu,
            classe, siege_label, prix, ajoute_le, date_voyage, transport_type
        )
        VALUES (
            ${panierId}, ${passagerId}, ${departHeure}, ${billetData.departLieu},
            ${arriveeHeure}, ${billetData.arriveeLieu},
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

export async function deletePanierItem(panierId, itemId) {
    return await sql`
        DELETE FROM panier_item WHERE panier_id = ${panierId} AND panier_item_id = ${itemId}
    `
}