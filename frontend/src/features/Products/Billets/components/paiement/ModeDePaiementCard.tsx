import ModeDePaiementItem from '../paiement/paiementItem'
import { useState } from 'react';
import PaiementForm from './paymentForm';
import creditCard_ico from '../../../../../assets/credit-card.svg'
import Paypal_ico from '../../../../../assets/paypal_ico.svg'
import ApplePay_ico from '../../../../../assets/applePay.svg'
import useIsMobile from '../../../../../components/layouts/UseIsMobile';



export default function ModeDePaiementCard({ clientSecret, setValidatePaymentOverlay, setTriggerPayment, passagersData, journey, formattedDepartureDate }: any) {
    const [selectedMode, setSelectedMode] = useState<string>("Carte bancaire");
    const isMobile = useIsMobile();

    return (
        <div className={` ${isMobile ? '' : 'm-20'} bg-[#133A40] border-2 border-[#2C474B] rounded-2xl p-5 mb-8 `}>
            <p className="font-bold mb-4">Mode de paiement</p>

            <div className={` ${isMobile ? 'grid grid-cols display-center ' : 'flex wrap '}  gap-4 border-t-2 border-b-2 border-[#2C474B]  py-4`}>
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
            {selectedMode === "Carte bancaire" && (
                <div style={{ position: "relative", zIndex: 50 }}>
                    <PaiementForm
                        clientSecret={clientSecret}
                        onSuccess={() => setValidatePaymentOverlay(true)}
                        onReady={(fn: () => void) => setTriggerPayment(() => fn)}
                        passagersData={passagersData}
                        journey={journey}
                        formattedDepartureDate={formattedDepartureDate}
                    />
                </div>
            )}



        </div>
    );
}