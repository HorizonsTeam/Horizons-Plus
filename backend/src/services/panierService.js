import {
    findActivePanierByUserId,
    findActivePanierBySessionId,
    createPanier,
    findPassagerByUserId,
    findPassagerByPanierId,
    insertPanierItem,
    getPanierItems,
    deletePanierItem,
    createPassager,
    checkPanierItemDoublon
} from '../repositories/panierRepository.js';

async function ensurePrimaryPassager(userId, panierId, userData) {
    let passager;

    if (userId) {
        passager = await findPassagerByUserId(userId);

        if (!passager || passager.length === 0) {
            passager = await createPassager({
                panier_id: panierId,
                user_id: userId,
                nom: userData.name,
                email: userData.email,
                date_naissance: userData.dateNaissance,
                telephone: userData.telephone,
            });
        }
    } else if (panierId) {
        passager = await findPassagerByPanierId(panierId);

        if (!passager || passager.length === 0) {
            passager = await createPassager({
                panier_id: panierId,
                nom: userData.name || "Invité",
                email: userData.email,
                date_naissance: userData.dateNaissance,
                telephone: userData.telephone,
            });
        }
    } else {
        throw new Error("Impossible de déterminer le passager : userId ou panierId requis");
    }

    return passager[0].passager_id;
}

async function getPanierForUser({ userId, sessionId }) {
    let panier;
        
    if (userId) {
        panier = await findActivePanierByUserId(userId);
    }
    
    if (!panier && sessionId) {
        panier = await findActivePanierBySessionId(sessionId);
    }
    
    if (!panier || panier.length === 0) {
        panier = await createPanier(userId ?? null, sessionId);
        
    }

    const items = await getPanierItems(panier[0].panier_id);
    
    return { 
        panier, 
        items 
    };
}

async function addBilletToPanier(userId, sessionId, journeyData, userData) {
    let panier;
        
    if (userId) {
        panier = await findActivePanierByUserId(userId);
    }
    
    if (!panier && sessionId) {
        panier = await findActivePanierBySessionId(sessionId);
    }
    
    if (!panier || panier.length === 0) {
        panier = await createPanier(userId ?? null, sessionId);
    }

    const panierId = panier[0].panier_id;
    console.log(userId, panierId, userData);

    const passagerId = await ensurePrimaryPassager(userId, panierId, userData);
    console.log(userId, panierId, userData);

    const j = journeyData.journey;

    const uniqueKey = [
        j.departureName,
        j.arrivalName,
        journeyData.dateVoyage,
        j.departureTime,
        j.arrivalTime,
        journeyData.transportType
    ].join("|");

    await insertPanierItem(panierId, passagerId, journeyData, uniqueKey);
    
    const items = await getPanierItems(panierId);

    return { panier: panier[0], items };
}

async function deleteBilletFromPanier(userId, sessionId, itemId) {
    let panier;
        
    if (userId) {
        panier = await findActivePanierByUserId(userId);
    }
    
    if (!panier && sessionId) {
        panier = await findActivePanierBySessionId(sessionId);
    }
    
    if (!panier || panier.length === 0) {
        panier = await createPanier(userId ?? null, sessionId);
    }

    const panierId = panier[0].panier_id;

    const deletedItem = await deletePanierItem(panierId, itemId);

    if (!deletedItem) {
        throw new Error("Item introuvable ou non autorisé");
    }

    return deletedItem;
}

export default {
    getPanierForUser,
    addBilletToPanier,
    deleteBilletFromPanier,
    ensurePrimaryPassager
};