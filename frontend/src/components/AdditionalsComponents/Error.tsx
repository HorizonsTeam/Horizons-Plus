
import type { JSX } from "react";
import NoResultsImage from "../../assets/LogoNotFound.png";

type ErrorProps = {
    errorMessage: string | null;
    errorBtns?:  JSX.Element;
} 


export default function Error({ errorMessage, errorBtns}: ErrorProps) {
    return (
        <>
            <div className="text-center text-red-400 font-bold py-10">


                <div className='flex justify-center'>
                    <div className=' p-6 rounded-2xl mt-4'>
                        <div className='flex justify-center'>
                            <img src={NoResultsImage} alt="" className=' relative  h-30 w-30 ' />
                        </div>
                        <h2 className='text-white font-bold text-2xl mt-4'>Oups...</h2>
                        {errorMessage}
                        <p className='text-white mt-5'>Désolé, aucun résultat ne correspond à votre recherche. Veuillez modifier vos critères et réessayer.</p>

                        <div className='flex w-full justify-between mt-10'>
                            {errorBtns}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}