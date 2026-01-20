import { useNavigate } from 'react-router-dom';
import { ArrowLeft} from 'lucide-react';
import useIsMobile from '../../../../components/layouts/UseIsMobile';


type headerProps = {
  Titre: string;
};

export default function Header({ Titre }: headerProps) {
  const navigate = useNavigate();
  const handleretour = () => {
    navigate(-1);

  }
  const ismobile = useIsMobile();
  return (
    <div className="w-full flex-wrap m-2 p-3  -mt-3 ">
      <div className="m-2 p-3 -mt-3  ">
        <div className="w-full relative mt-4 flex justify-center items-center">
          <button
            onClick={handleretour}
            aria-label="Retour"
            className={` ${!ismobile ? "absolute left-4 top-1/2 -translate-y-1/2" : "left-0 -translate-x-1/2 -ml-14 " }
    p-3
    rounded-full `
    }
          >
            <ArrowLeft size={30} strokeWidth={4} className='cursor-pointer transition duration-200 active:scale-95 focus:outline-none focus:ring-27 focus:ring-[#98EAF3] text-primary hover:text-white' />
          </button>





          <h1 className="text-3xl text-[#98EAF3] font-medium text-center">
            {Titre}
          </h1>
        </div>
      </div>
    </div>
  )
}