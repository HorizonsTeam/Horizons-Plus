
import type { JSX } from "react";
import NoResultsImage from "../../assets/LogoNotFound.png";

type ErrorProps = {
    errorMessage: string | null;
    errorBtns?:  JSX.Element;
} 


export default function Error({ errorMessage, errorBtns}: ErrorProps) {
    return (
        <>
            <div className="text-center text-red-400 font-bold py-10 w-full">


                <div className='flex justify-center'>
                    <div className=' p-6 rounded-2xl mt-4 grid gap-10'>
                        <div className='flex justify-center'>
                            <img src={NoResultsImage} alt="" className=' relative  h-30 w-30 ' />
                        </div>

                        {errorMessage && <span className="text-xl text-bold text-primary   " >{errorMessage}</span> 

                        
                        }

                        <div className=' w-full mt-10'>
                            {errorBtns}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}