export type Journey = {
    departureName: string;
    arrivalName: string;
    price: number;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    numberOfTransfers: number;
}

export type ProductCardProps =
{
    isAirPlane: boolean;
    journey: Journey;
    passagersCount: number;
    formattedDepartureDate: string;
}

export type DateStringProps = {
    date: Date;
};

export type BestPriceProps = {
    value: number | null;
};