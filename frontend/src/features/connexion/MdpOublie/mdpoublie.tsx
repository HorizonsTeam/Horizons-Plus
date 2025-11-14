import { Link } from 'react-router-dom';
import PageTransition from '../pageTransitions';
import { useState } from 'react';

export default function MdpOublie() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg("Veuillez entrer votre e-mail.");
      return;
    }

    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL ?? "http://localhost:3005/api/auth";

      const redirectTo = `${window.location.origin}/reset-password`;

      const r = await fetch(`${base}/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo }),
        credentials: "include",
      });

      // Peu importe la réponse (anti-énumération), on affiche un message neutre :
      if (!r.ok) {
        // on tente de lire un éventuel message mais on ne l’affiche pas pour la sécurité
        try { await r.json(); } catch {}
      }

      setSuccessMsg("Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.");
      setEmail("");
    } catch (err) {
      console.error(err);
      // Même message neutre pour ne pas donner d’info
      setSuccessMsg("Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="text-center min-h-screen flex flex-col mt-10 gap-6">
        <h1 className="text-4xl font-bold mt-5 mb-6 text-[#98EAF3]">Mot de passe oublié ?</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6 space-y-4">
          {successMsg && (
            <div className="w-full max-w-md bg-emerald-600/20 text-emerald-200 p-3 rounded">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="w-full max-w-md bg-red-600/20 text-red-200 p-3 rounded">
              {errorMsg}
            </div>
          )}

          <input
            type="email"
            placeholder="Votre e-mail"
            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            inputMode="email"
            autoComplete="email"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold"
          >
            {isLoading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
          </button>

          <div className="w-full max-w-md text-sm text-[#98EAF3] mt-2">
            <span className="opacity-80">
              Vous recevrez un lien pour définir un nouveau mot de passe.
            </span>
          </div>

          <div className="w-full max-w-md text-sm mt-6">
            <Link to="/login" className="text-[#98EAF3] hover:underline">
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
