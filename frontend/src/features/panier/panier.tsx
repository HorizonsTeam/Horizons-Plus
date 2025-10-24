import { Train } from 'lucide-react';
import ReturnBtn from '../../assets/ReturnBtn.svg';
import Planecard from './ProductCards/Plane'
import Traincard from './ProductCards/Train'

export default function Panier () {
    return (
        <>
        <div className='relative mt-4'>
        <img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' />
        < h1 className='text-3xl text-[#98EAF3] font-bold text-center'>Panier</h1>
        </div>
            <Traincard/>
            <Planecard/>
        </>

    )
}   



