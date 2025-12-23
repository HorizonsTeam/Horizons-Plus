import {
    findActivePanierByUser,
    createPanier,
    findPassager,
    insertPanierItem,
    getPanierItems,
    deletePanierItem
} from '../repositories/panierRepository.js';

async function getPanierForUser(userId) {
    const panier = await findActivePanierByUser(userId);

    if (panier.length === 0) return null;

    const panierId = panier[0].panier_id;
    const items = await getPanierItems(panierId);

    return { panier: panier[0], items };
}

async function addBilletToPanier(userId, billetData) {
    let panier = await findActivePanierByUser(userId);

    if (panier.length === 0) {
        panier = await createPanier(userId, "session-placeholder");
    }

    const panierId = panier[0].panier_id;

    const passager = await findPassager(userId);
    const passagerId = passager[0].passager_id;

    await insertPanierItem(panierId, passagerId, billetData);

    const items = await getPanierItems(panierId);

    return { panier: panier[0], items };
}

async function deleteBilletFromPanier(userId, itemId) {
    const panier = await findActivePanierByUser(userId);

    if (!panier || panier.length === 0) {
        throw new Error("Panier introuvable pour cet utilisateur");
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
    deleteBilletFromPanier
};