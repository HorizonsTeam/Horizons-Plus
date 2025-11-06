import ModeDePaiementItem from '../paiement/paiementItem'
export default function ModeDePaiementCard ()
{
    return (
        <>
            <div className='w-full items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 gap-2'>
                <p className='font-bold m-3 '>Mode de paiement </p>
                <div className=' w-full h-70  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 grid grid-cols  '>
                </div>
                <ModeDePaiementItem cardName='Carte bancaire' cardDescription='Visa, Mastercard...' IsSelected={true}/>
                <ModeDePaiementItem cardName='Paypal' cardDescription='jcp' IsSelected={false}/>
                <ModeDePaiementItem cardName='Apple Pay' cardDescription='jcp' IsSelected={false}/>
                
                

            </div>

        </>
    )
}