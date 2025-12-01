// Floating inputs with Tailwind peer classes
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect } from "react";


export default function PaiementForm({ clientSecret, onSuccess, onReady }: any) {

    const stripe = useStripe();
    const elements = useElements();

    console.log("stripe", stripe);
    console.log("elements", elements);
    // Style 
    const styleInput = {
        style: {
            base: {
                color: "white",
                fontSize: "16px",
            },
            invalid: {
                color: "#ff4d4f"
            }
        }
    };

    const handlePayment = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardNumberElement)!,
        }
    });

    if (result.error) {
        alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
    }
};

    useEffect(() => {
        if (stripe && elements && onReady) {
            onReady(() => handlePayment());   
        }
    }, [stripe, elements]);
    

    console.log("stripe", stripe, "elements", elements);
    return (

        <form onSubmit={(e) => {e.preventDefault(); handlePayment();}} className="mt-4 w-full grid gap-4">
            {/* Numéro de carte */}
            <div>
                <label className="text-gray-300 text-sm">Numéro de carte</label>
                <div className="rounded-xl bg-[#103035] px-4 py-3">
                    <CardNumberElement
                        options={{
                            style: {
                                base: {
                                    color: "#fff",
                                    fontSize: "15px",
                                },
                                invalid: {
                                    color: "red",
                                }
                            }
                        }}
                    />
                </div>

            </div>

            {/* Titulaire */}
            <div>
                <label className="text-gray-300 text-sm">Titulaire</label>
                <input
                    type="text"
                    placeholder="Nom"
                    className="w-full bg-[#103035] p-3 rounded-xl text-white outline-none"
                />
            </div>


            <div className="flex gap-4">
                {/* Expiration */}
                <div className="w-full">
                    <label className="text-gray-300 text-sm">Date d'expiration</label>
                    <div className="rounded-xl bg-[#103035] p-3" style={{ position: "relative", zIndex: 1 }}>
                        <CardExpiryElement options={styleInput} />
                    </div>
                </div>

                {/* CVV */}
                <div className="w-28">
                    <label className="text-gray-300 text-sm">CVV</label>
                    <div className="rounded-xl bg-[#103035] p-3" >
                        <CardCvcElement options={styleInput} />
                    </div>
                </div>
            </div>

            {/* Bouton payer */}

            {/* <button
                type="submit"
                className="w-full mt-2 h-[50px] bg-[#98EAF3] text-[#115E66] font-bold rounded-xl"
            >
                Payer
            </button> */}


        </form >
    );
}

