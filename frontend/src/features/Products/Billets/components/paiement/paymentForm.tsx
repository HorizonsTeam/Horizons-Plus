// Floating inputs with Tailwind peer classes
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useRef } from "react";

const FRENCH_MONTHS: Record<string, number> = {
  janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
};

function frenchDateToISO(str: string): string {
  const parts = str.trim().split(/\s+/);
  const day = Number(parts[1]);
  const month = FRENCH_MONTHS[parts[2]?.toLowerCase()];
  const year = Number(parts[3]);
  if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) {
    return new Date().toISOString().split("T")[0];
  }
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function PaiementForm({
  clientSecret,
  onSuccess,
  onReady,
  passagersData,
  journey,
  formattedDepartureDate,
  setIsPaying,
  confirmationBody,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const payingRef = useRef(false);
  const confirmationBodyRef = useRef(confirmationBody);
  const passagersDataRef = useRef(passagersData);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => { confirmationBodyRef.current = confirmationBody; }, [confirmationBody]);
  useEffect(() => { passagersDataRef.current = passagersData; }, [passagersData]);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);

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
    setIsPaying?.(true);

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

      const currentConfirmationBody = confirmationBodyRef.current;
      const currentPassagersData = passagersDataRef.current;
      const p0 = currentPassagersData?.[0];
      const emailForConfirmation = currentConfirmationBody?.email ?? p0?.email;
      if (!emailForConfirmation) {
        alert("Email manquant");
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

        const body = currentConfirmationBody ?? {
          email: p0.email,
          customerName: `${p0.firstname ?? ""} ${p0.lastname ?? ""}`.trim(),
          journey: `${journey.departureName} → ${journey.arrivalName}`,
          date: frenchDateToISO(formattedDepartureDate),
          time: `${journey.departureTime} - ${journey.arrivalTime}`,
          price: journey.price * (currentPassagersData?.length ?? 1),
          passengers: currentPassagersData?.length ?? 1,
        };

        try {
          const response = await fetch(
            `${API_BASE}/api/payments/send-confirmation`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );

          if (!response.ok) {
            const txt = await response.text().catch(() => "");
            throw new Error(txt || "Erreur lors de la création de la réservation");
          }

          const data = await response.json();
          console.log("Réservation(s) créée(s):", data.ticketIds ?? data.ticketId);
          onSuccessRef.current?.();
        } catch (error) {
          console.error("Erreur:", error);
        }
      }
    } finally {
      payingRef.current = false;
      setIsPaying?.(false);
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
