import sql from '../../db.js';

function generateSessionId() {
    return "session_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function getOrCreatePanier(sessionId) {
    if (!sessionId || sessionId === 'null' || sessionId === 'undefined') {
        sessionId = generateSessionId();
    }

    // Chercher le panier
    let panier = await sql`
        SELECT * FROM panier WHERE session_id = ${sessionId}
    `;

    // Si pas trouvé, le créer
    if (panier.length === 0) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        await sql`
            INSERT INTO panier (session_id, cree_le, expire_le, statut) 
            VALUES (${sessionId}, NOW(), ${expireDate}, 'ACTIF')
        `;

        return { sessionId, panier: null, items: [] };
    }

    const panierId = panier[0].panier_id;

    const items = await sql`
        SELECT * FROM panier_item WHERE panier_id = ${panierId}
    `;

    return { 
        sessionId, 
        panier: panier[0],
        items 
    };
}

async function getPanier(sessionId) {
    const panier = await sql`
        SELECT * FROM panier WHERE session_id = ${sessionId}
    `;

    if (panier.length === 0) return null;

    const panierId = panier[0].panier_id;

    const items = await sql`
        SELECT * FROM panier_item WHERE panier_id = ${panierId}
    `;

    return { 
        sessionId, 
        panier: panier[0],
        items 
    };
}

export default {
    getPanier,
    getOrCreatePanier
}