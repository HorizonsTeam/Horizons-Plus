import {
    findActivePanierByUserId,
    findActivePanierBySessionId,
    createPanier,
    findPassagerByPanierId,
    insertPanierItem,
    getPanierItems,
    deletePanierItem,
    createPassager,
    checkPanierItemDoublon
} from '../repositories/panierRepository.js';

async function ensurePrimaryPassager(panierId, userData) {
    console.log("la mtn c'est : ", panierId);
    let passager = await findPassagerByPanierId(panierId);

    if (!passager || passager.length === 0) {
        passager = await createPassager({
            panier_id: panierId,
            name: userData.name,
            email: userData.email,
        });
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

async function addBilletToPanier(userId, sessionId, billetData, userData) {
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

    const passagerId = await ensurePrimaryPassager(panierId, userData);

    const hasDoublon = await checkPanierItemDoublon(panierId, billetData);
    if (hasDoublon) {
        throw new Error("Ce trajet est déjà dans le panier");
    }

    await insertPanierItem(panierId, passagerId, billetData);

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