
import ReturnBtn from '../../assets/ReturnBtn.svg';
import Right_ico from '../../assets/Right_Ico.svg'
import Left_ico from '../../assets/Left_Ico.svg'

import Train_Ico from '../../assets/train_ico2.svg';
import Plane_Ico from '../../assets/plane_ico2.svg';
import Productcard from './ProductCard/ProductCard.tsx';
import { useState } from 'react';
import BestPrice from './ProductCard/bestPrice.tsx';
import Date_String from './Date.tsx';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../components/layouts/UseIsMobile.tsx';



export default function Resultats ()
{
    const navigate = useNavigate();
    const handleretour = () =>
    {
        navigate(-1);
    }
    const [planeSearch, setPlanSearch] = useState(false);
    const [all, setAllSearch] = useState(true);
    const [train, setTrainSearch] = useState(false);
    const [date, setDate] = useState(new Date());
    const IsMobile = useIsMobile (); 


    return (
        <>
        
        <div className=" flex items-center justify-center mt-6">
                <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-10 transform -translate-y-1/2' /></button>
            <div>
                <h3 className='font-bold text-[#98EAF3] text-xl'> Nevers - Moulin.... </h3>
                <h4 className='text-[#98EAF3]'>1 passagers </h4>
            </div>
        </div>
        <div className="flex items-center justify-center space-x-4 bg-dark p-4">
            <button className="border-4 border-[#98EAF3] rounded-xl p-2  w-13 " 
            onClick={() => {  
                const nextDay = new Date(date);  
                nextDay.setDate(nextDay.getDate() - 1);  
                setDate(nextDay);
                }
                }>
                <img src={Left_ico} alt="" className='ml-2' />
            </button>

            <Date_String date={date} />


            <button className="border-4 border-[#98EAF3] rounded-xl p-2  w-13 " 
            onClick={() => {  
                const nextDay = new Date(date);  
                nextDay.setDate(nextDay.getDate() + 1);  
                setDate(nextDay);
                }
                }>

                <img src={Right_ico} alt="" className='ml-2'/>
            </button>
        </div>
        <div className="flex items-center justify-between w-full -ml-0.25 m-10 ">
            <button onClick={() => {setPlanSearch(false)
                setTrainSearch(true);
                setAllSearch(false);
            }
            
                } className={`w-2/3 h-[68px] flex justify-center items-center border-b-4 border-b-white rounded-tr-3xl transition-colors duration-300 ${planeSearch ? 'bg-transparent' : 'bg-[#133A40] border-b-[#98EAF3]'  } ${all && 'bg-transparent'  } ${train && 'bg-[#133A40]'}`}>
                <div >
                <img src={Train_Ico} alt="Train" className=""  />
                {train ? <BestPrice /> : null}
                </div>
            </button>
 
                <button className={`w-2/3 h-[68px] grid grid-col justify-center items-center border-b-4  rounded-tl-3xl transition-colors duration-300 ${planeSearch ? 'bg-[#133A40] border-b-[#98EAF3]' : 'bg-transparent' } ${all && 'bg-transparent'  }`} 
            onClick={() => {  
                setPlanSearch(true);
                setAllSearch(false);
                setTrainSearch(false);
            }}>
                <img src={Plane_Ico} alt="Avion" className="" />
                {planeSearch ? <BestPrice /> : null}
            </button>


        </div>
        <div className="bg-[#133A40] px-4 pt-5 -mt-10 w-full  h-300x  ">

                <div className={`w-full flex justify-left  items-centre -ml-3 ${IsMobile ? " gap-2 " : " gap-7 " } `}>
                <button className="flex items-center gap-1 border-[#98EAF3] border-2 px-4 py-2 rounded-full text-[#98EAF3]  rounded-full text-sm w-24">
                <span className='-ml-1'>Horaires </span>
                <span className="text-[#98EAF3]">▼</span>
                </button>

               
                <button className="flex items-left  gap-1 border-[#98EAF3] border-2 px-4 py-2 rounded-full text-[#98EAF3] px-4 py-2 rounded-full text-sm w-20">
                <span className='-ml-1'>Gares </span>
                <span className="text-[#98EAF3]">▼</span>
                </button>

                <button className="flex items-center gap-1 border-[#98EAF3] border-2 px-4 py-2 rounded-full text-[#98EAF3] text-[#98EAF3] px-4 py-2 rounded-full text-sm w-24">
                <span className='-ml-1'>Départs </span>
                <span className="text-[#98EAF3]">▼</span>
                </button>

                <button className="flex items-center gap-2 text-[#133A40] bg-[#98EAF3] px-4 py-2 rounded-full text-sm w-20">
                <span className='-ml-1'>Direct</span>
                <span className="text-[#133A40]">▼</span>
                </button>
            </div>
                <div className={`w-full ${IsMobile ? 'm-3 ' : 'px-40'}`}>
            <Productcard airPlane={planeSearch}/>    
            <Productcard airPlane={planeSearch}/>
            <Productcard airPlane={planeSearch}/>
            <Productcard airPlane={planeSearch}/>
            <Productcard airPlane={planeSearch}/>
            <Productcard airPlane={planeSearch}/>
            </div>
        
        </div>


    


        </>
    )
}