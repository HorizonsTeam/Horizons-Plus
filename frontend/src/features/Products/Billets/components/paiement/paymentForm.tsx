// Floating inputs with Tailwind peer classes
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useRef } from "react";

export default function PaiementForm({
  clientSecret,
  onSuccess,
  onReady,
  passagersData,
  journey,
  formattedDepartureDate,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const payingRef = useRef(false);

  const styleInput = {
    style: {
      base: { color: "white", fontSize: "16px" },
      invalid: { color: "#ff4d4f" },
    },
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    if (payingRef.current) return;
    payingRef.current = true;

    try {
        // si client validé
      if (
        !clientSecret ||
        typeof clientSecret !== "string" ||
        !clientSecret.includes("_secret_")
      ) {
        console.log("clientSecret invalide:", clientSecret);
        alert("clientSecret invalide");
        return;
      }

      const p0 = passagersData?.[0];
      if (!p0?.email) {
        alert("Email passager manquant");
        return;
      }

      const cardEl = elements.getElement(CardNumberElement);
      if (!cardEl) {
        alert("Champ carte pas prêt");
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardEl },
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const API_BASE = import.meta.env.VITE_API_URL || "";

        try {
          const response = await fetch(
            `${API_BASE}/api/payments/send-confirmation`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: p0.email,
                customerName: `${p0.firstname ?? ""} ${p0.lastname ?? ""}`.trim(),
                journey: `${journey.departureName} → ${journey.arrivalName}`,
                date: formattedDepartureDate,
                time: `${journey.departureTime} - ${journey.arrivalTime}`,
                price: journey.price * (passagersData?.length ?? 1),
                passengers: passagersData?.length ?? 1,
              }),
            }
          );

          if (!response.ok) {
            const txt = await response.text().catch(() => "");
            throw new Error(txt || "Erreur lors de la création de la réservation");
          }

          const data = await response.json();
          console.log("Réservation créée:", data.ticketId);
          alert(`Réservation créée ! Votre ID billet : ${data.ticketId}`);
          onSuccess();
        } catch (error) {
          console.error("Erreur:", error);
          alert("Erreur lors de la création de la réservation");
        }
      }
    } finally {
      payingRef.current = false;
    }
  };

  useEffect(() => {
    if (stripe && elements && onReady) {
      onReady(() => handlePayment());
    }
  }, [stripe, elements, onReady]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlePayment();
      }}
      className="mt-4 w-full grid gap-4"
    >
      <div>
        <label className="text-gray-300 text-sm">Numéro de carte</label>
        <div className="rounded-xl bg-[#103035] px-4 py-3">
          <CardNumberElement
            options={{
              style: {
                base: { color: "#fff", fontSize: "15px" },
                invalid: { color: "red" },
              },
            }}
          />
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm">Titulaire</label>
        <input
          type="text"
          placeholder="Nom"
          className="w-full bg-[#103035] p-3 rounded-xl text-white outline-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-full">
          <label className="text-gray-300 text-sm">Date d'expiration</label>
          <div
            className="rounded-xl bg-[#103035] p-3"
            style={{ position: "relative", zIndex: 1 }}
          >
            <CardExpiryElement options={styleInput} />
          </div>
        </div>

        <div className="w-28">
          <label className="text-gray-300 text-sm">CVV</label>
          <div className="rounded-xl bg-[#103035] p-3">
            <CardCvcElement options={styleInput} />
          </div>
        </div>
      </div>
    </form>
  );
}
