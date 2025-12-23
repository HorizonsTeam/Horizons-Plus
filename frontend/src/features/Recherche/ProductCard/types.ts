export type Journey = {
    departureName: string;
    arrivalName: string;
    price: number;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    numberOfTransfers: number;
    simulated: boolean;
}

export type ProductCardProps =
{
    journey: Journey;
    passagersCount: number;
    formattedDepartureDate: string;
    index?: number;
}

export type DateStringProps = {
    date: Date;
};

export type BestPriceProps = {
    value: number | null;
};
