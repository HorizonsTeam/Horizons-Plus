import ModeDePaiementItem from '../paiement/paiementItem'
import { useState } from 'react';
import PaiementForm from './paymentForm';
import creditCard_ico from '../../../../../assets/credit-card.svg'
import Paypal_ico from '../../../../../assets/paypal_ico.svg'
import ApplePay_ico from '../../../../../assets/applePay.svg'



export default function ModeDePaiementCard() {
    const [selectedMode, setSelectedMode] = useState<string>("Carte bancaire"); // 👈 état pour le mode sélectionné
    
    return (
        <div className="w-full p-6 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 text-white">
            <p className="font-bold mb-4">Mode de paiement</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-b-2 border-[#2C474B] py-4">
                <ModeDePaiementItem
                    cardName="Carte bancaire"
                    cardDescription="Visa, Mastercard..."
                    IsSelected={selectedMode === "Carte bancaire"}
                    onClick={() => setSelectedMode("Carte bancaire")
                        
                    }
                    icone={creditCard_ico}
                />
                <ModeDePaiementItem
                    cardName="Paypal"
                    cardDescription="Payez facilement en ligne"
                    IsSelected={selectedMode === "Paypal"}
                    onClick={() => setSelectedMode("Paypal")
                        
                    }
                    icone={Paypal_ico              
                    }
                />
                <ModeDePaiementItem
                    cardName="Apple Pay"
                    cardDescription="Paiements rapides et sécurisés"
                    IsSelected={selectedMode === "Apple Pay"}
                    onClick={() => setSelectedMode("Apple Pay")}
                    icone={ApplePay_ico}
                />
            </div>
            { selectedMode === "Carte bancaire" &&
                
            <div className=' mt-3 w-full '>
                <PaiementForm />
            </div>

            }
            

            
        </div>
    );
}