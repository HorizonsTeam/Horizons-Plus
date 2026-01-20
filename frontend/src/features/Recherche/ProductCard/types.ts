import type { Stop, Leg } from "../../Products/Billets/components/Recap/Correspendances.tsx";

export type Journey = {
    departureName: string;
    arrivalName: string;
    price: number;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    numberOfTransfers: number;
    simulated: boolean;
    stops: Stop[];
    legs: Leg[];
}

export type ProductCardProps =
{
    journey: Journey;
    passagersCount: number;
    formattedDepartureDate: string;
    index?: number;
    IsLoading?: boolean;
    isTrain :boolean;
}

export type DateStringProps = {
    date: Date;
};

export type BestPriceProps = {
    value: number | null;
};
