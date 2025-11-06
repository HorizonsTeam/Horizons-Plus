

type Props =
{
    IsSelected :boolean;
    cardName : string ; 
    cardDescription : string;
}


export default function ModeDePaiementItem( {IsSelected,cardName,cardDescription} : Props)
{
    
    return (
        <>
        <button className="bg-red w-80 h-30"></button>
        </>
    );
}