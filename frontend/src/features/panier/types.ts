import type { Stop, Leg } from "../Products/Billets/components/Recap/Correspendances.tsx";
import type { Journey } from "../Recherche/ProductCard/types.ts";

export type TransportType = 'TRAIN' | 'AVION';

export type PanierItem = {
    id: number;
    panierId: number;
    passagerId: number;

    classe: string;
    siegeRestant: string;
    prix: number;
    dateVoyage: Date;
    typeTransport: string;

    departHeure: string;
    arriveeHeure: string;
    departLieu: string;
    arriveeLieu: string;

    ajouteLe: Date;

    journey: Journey;
};

export type BackendPanierItem = {
    panier_item_id: number;
    panier_id: number;
    passager_id: number;
    ajoute_le: string;
    journey_data: {
        classe: string;
        siegeRestant: string;
        dateVoyage: string;
        transportType: string;

        journey: {
            departureName: string;
            arrivalName: string;
            price: string;
            departureTime: string;
            arrivalTime: string;
            duration: string;
            numberOfTransfers: number;
            simulated: boolean;
            stops: Stop[];
            legs: Leg[];
        };
    };
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
    onDeleted: (id: number) => void;
    setisItemDeleted?: React.Dispatch<React.SetStateAction<boolean>>;
}