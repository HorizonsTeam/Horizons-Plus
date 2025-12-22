export type TransportType = 'TRAIN' | 'AVION';

export type PanierItem = {
    id: number;
    panierId: number;
    passagerId: number;
    departHeure: Date;
    departLieu: string;
    arriveeHeure: Date;
    arriveeLieu: string;
    classe: string;
    siegeLabel: string;
    prix: number;
    ajouteLe: Date;
    dateVoyage: Date;
    typeTransport: TransportType;
}

export type BackendPanierItem = {
    panier_item_id: number;
    panier_id: number;
    passager_id: number;
    depart_heure: string;
    depart_lieu: string;
    arrivee_heure: string;
    arrivee_lieu: string;
    classe: string;
    siege_label: string;
    prix: string;
    ajoute_le: string;
    date_voyage: string;
    transport_type: 'TRAIN' | 'AVION';
};

export type BackendPanierResponse = {
    panier: {
        panier_id: number;
        user_id: string;
        session_id: string;
        cree_le: string;
        expire_le: string;
        statut: string;
    };
    items: BackendPanierItem[];
};

export type TrainCardProps = {
    item: PanierItem;
}