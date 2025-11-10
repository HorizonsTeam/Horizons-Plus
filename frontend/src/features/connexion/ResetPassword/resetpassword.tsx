import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTransition from "../pageTransitions";

export default function ResetPassword() {
  const navigate = useNavigate();
  const search = new URLSearchParams(useLocation().search);
  const token =
    search.get("token") ||
    search.get("code") ||
    search.get("oobCode") ||
    "";
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // le token peut être vide en "cookie flow"
    if (pwd1.length < 8) return setErrorMsg("Minimum 8 caractères.");
    if (pwd1 !== pwd2) return setErrorMsg("Les mots de passe ne correspondent pas.");

    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_AUTH_URL ?? "http://localhost:3005/api/auth";

      async function tryReset(body: any) {
        const r = await fetch(`${base}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include",
        });
        let data: any = null;
        try { data = await r.json(); } catch { }
        return { ok: r.ok, status: r.status, data };
      }

      // version “classique” : token + password
      let resp = token ? await tryReset({ token, password: pwd1 }) : { ok: false, status: 0, data: null };

      // certaines variantes utilisent 'code' au lieu de 'token'
      if (!resp.ok && token) {
        resp = await tryReset({ code: token, password: pwd1 });
      }

      // cookie flow : le token est en cookie HttpOnly, on envoie seulement { password }
      if (!resp.ok) {
        resp = await tryReset({ password: pwd1 });
      }

      // très rares variantes : 'newPassword'
      if (!resp.ok && token) {
        resp = await tryReset({ token, newPassword: pwd1 });
      }
      if (!resp.ok) {
        resp = await tryReset({ newPassword: pwd1 });
      }

      if (!resp.ok) {
        console.warn("reset-password failed:", resp.status, resp.data);
        throw new Error(resp?.data?.error || "Lien invalide ou expiré.");
      }

      setSuccessMsg("Mot de passe modifié. Redirection…");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Lien invalide ou expiré.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="text-center min-h-screen flex flex-col mt-10 gap-6">
        <h1 className="text-4xl font-bold mt-5 mb-6 text-[#98EAF3]">Définir un nouveau mot de passe</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6 space-y-4">
          {successMsg && <div className="w-full max-w-md bg-emerald-600/20 text-emerald-200 p-3 rounded">{successMsg}</div>}
          {errorMsg && <div className="w-full max-w-md bg-red-600/20 text-red-200 p-3 rounded">{errorMsg}</div>}

          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="w-full max-w-md bg-[#2C474B] text-white rounded-lg p-3 focus:ring-2 focus:ring-[#98EAF3]"
            value={pwd1}
            onChange={(e) => setPwd1(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="w-full max-w-md bg-[#2C474B] text-white rounded-lg p-3 focus:ring-2 focus:ring-[#98EAF3]"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={isLoading} className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold">
            {isLoading ? "Validation..." : "Enregistrer"}
          </button>

          <div className="w-full max-w-md text-sm mt-6">
            <Link to="/login" className="text-[#98EAF3] hover:underline">← Retour à la connexion</Link>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
