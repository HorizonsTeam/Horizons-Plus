import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../pageTransitions';
import { useState } from 'react';
import { authClient } from '../../../lib/auth-clients';
import type React from 'react';
import useIsMobile from '../../../components/layouts/UseIsMobile';

export default function Login() {

  const navigate = useNavigate();

  // états des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // états des UI
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {

      setErrorMsg("Veuillez entrer votre email et votre mot de passe.");
      return;
    }

    setIsLoading(true);
    try {
      // Appel de Better AUth
      // rememberMe pour se souvenir de nous lors de la connexion
      await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: "/", // Après connexion on se dirige à l"accueil
      });

      navigate("/")
    } catch (err: any) {
      console.error("signin error", err);
      setErrorMsg(err?.message || "Identifiants invalides.");
    } finally {
      setIsLoading(false);
    }

  };

  const signInWithGoogle = async () => {
    setErrorMsg("Connexion avec Google pas encore disponible. Merci de vous connecter normalement. :)")
  };

  return (
    <PageTransition>
      <div className={`text-center min-h-screen flex flex-col mt-17 lg:mt-13   gap-6 ${useIsMobile() ? 'w-full px-4' : 'w-full'} `}>
                      <h1 className="text-4xl font-bold   text-[#98EAF3] mb-5 lg:mb-10">

          Connectez-vous
        </h1>


        <form
          onSubmit={handleSubmit}
          className={`flex flex-col items-center  mt-1  space-y-4 `}
        >

          {/* bloc erreur */}
          {errorMsg && (
            <div className="w-full max-w-md bg-red-600/20 text-red-200 p-3 rounded">
              {errorMsg}
            </div>
          )}


          <input
            type="email"
            placeholder="E-mail"
            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* A faire cette fonctionnalité de la partie Authentification */}
          <div className="w-full max-w-md text-right">
            <a href="/mdpoublie" className="text-sm text-[#98EAF3] hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold -mb-3"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          {/* Ou */}
          <div className="flex items-center justify-center w-full max-w-md my-10 mb-17 gap-3">
            <div className="flex-grow h-px bg-[#98EAF3]"></div>
            <span className="mx-4 text-[#98EAF3] font-medium text-2xl">Ou</span>
            <div className="flex-grow h-px bg-[#98EAF3]"></div>
          </div>

          {/* Connexion Google */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="bg-[#FFFFFF] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold flex items-center justify-center  mb-10 -mt-10 gap-2"
          >
            <img src="src/assets/Google_Favicon_2025.svg" alt="google logo" className="mr-2 w-6 h-6" />
            Continuer avec Google
          </button>


          <h2>Pas de Compte ?<Link to="/singin" className="text-[#98EAF3]"> Inscrivez-vous</Link>
          </h2>

        </form>
      </div>

    </PageTransition>
  );
}
