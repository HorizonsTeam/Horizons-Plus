import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../lib/auth-clients";

export default function TwoFactor() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const OTP_SENT_KEY = "hp_2fa_otp_sent_at";

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const r = await (authClient as any).twoFactor.sendOtp();
      if (r?.error) throw new Error(r.error?.message || "Impossible d'envoyer le code.");

      setSent(true);
    } catch (e: any) {
      setErrorMsg(e?.message || "Erreur lors de l'envoi du code.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const last = Number(sessionStorage.getItem(OTP_SENT_KEY) || "0");
    const now = Date.now();

    if (now - last < 15000) {
      setSent(true);
      return;
    }

    sessionStorage.setItem(OTP_SENT_KEY, String(now));
    void sendOtp();
  }, []);

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const r = await (authClient as any).twoFactor.verifyOtp({
        code,
        trustDevice: true,
      });

      if (r?.error) throw new Error(r.error?.message || "Code invalide ou expiré.");

      sessionStorage.removeItem(OTP_SENT_KEY);
      navigate("/");
    } catch (e: any) {
      setErrorMsg(e?.message || "Code invalide.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-[#98EAF3] mb-4">Vérification 2FA</h1>

      <p className="text-white/80 mb-6">
        {sent ? "Un code a été envoyé par email." : "Envoi du code..."}
      </p>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Code (ex: 123456)"
        className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
      />

      <button
        onClick={handleVerify}
        disabled={isLoading || code.trim().length < 4}
        className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold mt-4"
      >
        {isLoading ? "Vérification..." : "Valider"}
      </button>

      <button
        type="button"
        onClick={() => void sendOtp()}
        disabled={isLoading}
        className="text-sm text-[#98EAF3] hover:underline mt-4 disabled:opacity-50"
      >
        Renvoyer le code
      </button>

      {errorMsg ? <p className="text-red-200 mt-4">{errorMsg}</p> : null}
    </div>
  );
}
