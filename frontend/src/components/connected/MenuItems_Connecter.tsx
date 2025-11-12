import { Link } from "react-router-dom";
import Reservation_ico from '../../assets/Resrvation_ico.svg'
import Panier_Ico from '../../assets/Panier_Ico.svg'
import Carte_Reduc_Ico from '../../assets/Carte_Reduc_Ico.svg'

export default function Menu_items_Connecter ()
{
    return (
        <div className="flex display-flex border-b-3 border-[#4A6367] w-85 ml-7  mt-6">
            <div className="grid grid-cols gap-5  mb-5  mt-2 w-10">
                <img src={Reservation_ico} alt="" />
                <img src={Panier_Ico} alt="" />
                <img src={Carte_Reduc_Ico} alt="" />

            </div>
            <div className="grid grid-cols gap-5  w-full items-left mb-5">
                <Link to="/" className="text-left font-bold text-xl"> <span>Mes Reservations</span> </Link>
                <Link to="/" className="text-left text-xl font-bold"> Panier </Link>
                <Link to="/" className="text-left font-bold text-xl ">Mes cartes de réduction </Link>
            </div>

            
            
            

        </div>

    );
}