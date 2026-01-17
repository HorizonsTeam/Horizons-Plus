import Panier from '../../assets/Panier.svg';
import useIsMobile from '../layouts/UseIsMobile';
import { useLocation, useNavigate } from 'react-router-dom';

type PanierBtnProps = {
    nombresArticles?: number;
};

export default function PanierBtn({ nombresArticles = 2 }: PanierBtnProps) {
    const isMobile = useIsMobile();
    const location = useLocation();
    const navigate = useNavigate();

    if (!isMobile || nombresArticles === 0) {
        return null;
    }

    if (location.pathname === '/panier') {
        return null;
    }

    return (
        <div
            className="fixed bottom-2 right-2 z-15 w-20 h-20 flex justify-center bg-[#FFB856] rounded-3xl py-6 gap-1"
            onClick={() => {
                navigate('/panier');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        >
            <img src={Panier} alt="Panier" className="h-7 w-7" />
            <h1 className="text-[#103035] font-bold text-xl">
                {nombresArticles > 0 && 'x' + nombresArticles}
            </h1>
        </div>
    );
}
