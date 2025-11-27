export type Journey = {
    departureName: string;
    arrivalName: string;
    price: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    numberOfTransfers: number;
}

export type ProductCardProps =
{
    isAirPlane: boolean;
    journey: Journey;
}

export type DateStringProps = {
    date: Date;
};