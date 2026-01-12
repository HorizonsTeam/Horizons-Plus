import Panier from '../../assets/Panier.svg';
import useIsMobile from '../layouts/UseIsMobile';
import { useLocation } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';               

type PanierBtnProps = {
    nombresArticles?: number;
};

export default function PanierBtn( { nombresArticles = 2}: PanierBtnProps) 
{
    const isMobile = useIsMobile();
    if (!isMobile || nombresArticles === 0) {
        return null;
    }

    const Location = useLocation();
    if (Location.pathname == '/panier')
    {
        return null;
    }
   const Navigate = useNavigate();

    return (
        <>
            <div className="fixed bottom-2 right-2 z-15 w-20 h-20  flex justify-center bg-[#FFB856] rounded-3xl py-6 gap-1" onClick={()=> {Navigate('/panier');window.scrollTo({ top: 0, behavior: "smooth" })}} >
                      <img src={Panier} alt="Panier"  className='h-7 w-7'/>
                <h1 className='text-[#103035] font-bold text-xl'>{nombresArticles>0 && 'x' + nombresArticles }</h1>

            </div>
        </>
    );


}