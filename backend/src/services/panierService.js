import {
    findActivePanierByUser,
    createPanier,
    findPassager,
    insertPanierItem,
    getPanierItems,
    deletePanierItem,
    createPassager
} from '../repositories/panierRepository.js';

async function ensurePrimaryPassager(userId, userData) {
    let passager = await findPassager(userId);

    if (!passager || passager.length === 0) {
        passager = await createPassager({
            user_id: userId,
            name: userData.name,
            email: userData.email,
            is_primary: true, // marque comme passager principal
        });
    }

    return passager[0];
}

async function getPanierForUser(userId) {
    const panier = await findActivePanierByUser(userId);

    if (panier.length === 0) return null;

    const panierId = panier[0].panier_id;
    const items = await getPanierItems(panierId);

    return { panier: panier[0], items };
}

async function addBilletToPanier(userId, billetData, userData) {
    console.log("la: ", userId, billetData, userData);

    let panier = await findActivePanierByUser(userId);

    if (panier.length === 0) {
        panier = await createPanier(userId, "session-placeholder");
    }

    const panierId = panier[0].panier_id;

    const passager = await ensurePrimaryPassager(userId, userData);
    const passagerId = passager.passager_id;

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
    deleteBilletFromPanier,
    ensurePrimaryPassager
};