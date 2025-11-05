
import sheild from '../../../../assets/shield.svg'


export default function Serinita_card ()
{
    return (
        <div className='w-full items-center   bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5 '>
            <div className='border-b-3 border-[#2C474B] '>
                <p className='m-4 font-semibold '>Conditions d’annulation et d’échanges</p>
            </div>
            <div className="flex gap-4 p-3 items-center">
                <img src={sheild} alt="" className='w-10 h-10' />
                <div className='grid p-2'>
                    <p className='font-bold text-left mb-2 '>Serenita</p>
                    <p className='text-left text-xs font-semibold'>Changement de réservation et échange de 
                        billets possible. Remboursement soumis à des frais de 20%.</p>

                </div>
            </div>
            

        </div>

    );
}