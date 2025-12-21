import sql from '../../db.js';

// function generateSessionId() {
//     return "session_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
// }

async function getOrCreatePanier(userId) {
    let panier = await sql`
        SELECT * FROM panier WHERE user_id = ${userId} AND statut = 'ACTIF'
    `;

    // Si pas trouvé, le créer
    if (panier.length === 0) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        const sessionId = 'user_' + userId + '_' + Date.now();

        await sql`
            INSERT INTO panier (user_id, session_id, cree_le, expire_le, statut) 
            VALUES (
                ${userId},
                ${sessionId}, 
                NOW(), 
                ${expireDate}, 
                'ACTIF'
            )
        `;

        panier = await sql`
            SELECT * FROM panier WHERE user_id = ${userId} AND statut = 'ACTIF'
        `;
    }

    const panierId = panier[0].panier_id;

    const items = await sql`
        SELECT * FROM panier_item WHERE panier_id = ${panierId}
    `;

    return {
        panier: panier[0],
        items
    };
}

async function getPanier(userId) {
    const panier = await sql`
        SELECT * FROM panier WHERE user_id = ${userId} AND statut = 'ACTIF'
    `;

    if (panier.length === 0) return null;

    const panierId = panier[0].panier_id;

    const items = await sql`
        SELECT * FROM panier_item WHERE panier_id = ${panierId}
    `;

    return { 
        panier: panier[0],
        items 
    };
}

export default {
    getPanier,
    getOrCreatePanier
}