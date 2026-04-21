import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../pageTransitions';
import { useState } from 'react';
import { authClient } from '../../../lib/auth-clients';
import type React from 'react';
import useIsMobile from '../../../components/layouts/UseIsMobile';
import PopUp from '../../../components/AdditionalsComponents/PopUp';
import { loginSchema, type LoginValues } from '../login-validation';
import { flattenErrors, type FieldErrors } from '../validation-shared';

export default function Login() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginValues>>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({
    email: false,
    password: false,
  });

  const revalidate = (values: LoginValues) => {
    const parsed = loginSchema.safeParse(values);
    setFieldErrors(parsed.success ? {} : flattenErrors<LoginValues>(parsed.error));
  };

  const shouldShow = (field: keyof LoginValues) => (submitted || touched[field]) && !!fieldErrors[field];

  const onEmailChange = (v: string) => {
    setEmail(v);
    if (submitted || touched.email) revalidate({ email: v, password });
  };
  const onPasswordChange = (v: string) => {
    setPassword(v);
    if (submitted || touched.password) revalidate({ email, password: v });
  };

  const onBlur = (field: keyof LoginValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    revalidate({ email, password });
  };

  const [popupMsg, setPopupMsg] = useState<string | null>(null);
  const [popupMode, setPopupMode] = useState<"good" | "bad" | "question">("question");
  const [popupBtn, setPopupBtn] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);

  const closePopup = () => setPopupMsg(null);

  const showError = (msg: string) => {
    setPopupMsg(msg);
    setPopupMode("bad");
    setPopupBtn(
      <button className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg font-bold cursor-pointer" onClick={closePopup}>
        Réessayer
      </button>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPopupMsg(null);
    setFieldErrors({});

    setSubmitted(true);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(flattenErrors<LoginValues>(parsed.error));
      return;
    }

    setIsLoading(true);
    setPopupMsg("Connexion en cours...");
    setPopupMode("question");
    setPopupBtn(null);

    try {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: true,
        callbackURL: "/",
      });

      if (result?.error) {
        showError(
          result.error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "Email ou mot de passe incorrect."
            : result.error.message || "Connexion impossible."
        );
        return;
      }

      if ((result as any)?.data?.twoFactorRedirect) {
        navigate("/two-factor", { state: { email: parsed.data.email } });
        return;
      }

      setPopupMsg("Connexion réussie !");
      setPopupMode("good");
      setPopupBtn(
        <button
          className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg font-bold cursor-pointer"
          onClick={() => { closePopup(); navigate("/"); }}
        >
          Continuer
        </button>
      );

    } catch (err: any) {
      console.error("signin error", err);
      showError(err?.message || "Erreur inattendue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setPopupMsg("Connexion avec Google pas encore disponible. Merci de vous connecter normalement. :)");
    setPopupMode("question");
    setPopupBtn(
      <button className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg font-bold cursor-pointer" onClick={closePopup}>
        OK
      </button>
    );
  };

  const inputClass = "w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition";
  const errorClass = "w-full max-w-md text-left text-sm text-red-300 -mt-2";

  return (
    <PageTransition>
      <div className={`text-center min-h-screen flex flex-col mt-17 lg:mt-13 gap-6 ${isMobile ? 'w-full px-4' : 'w-full'}`}>
        <h1 className="text-4xl font-bold text-[#98EAF3] mb-5 lg:mb-10">Connectez-vous</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center mt-1 space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className={inputClass}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={shouldShow("email")}
          />
          {shouldShow("email") && <p className={errorClass}>{fieldErrors.email}</p>}

          <input
            type="password"
            placeholder="Mot de passe"
            className={inputClass}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => onBlur("password")}
            aria-invalid={shouldShow("password")}
          />
          {shouldShow("password") && <p className={errorClass}>{fieldErrors.password}</p>}

          <div className="w-full max-w-md text-right">
            <Link to="/mdpoublie" className="text-sm text-[#98EAF3] hover:underline">Mot de passe oublié ?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="flex items-center justify-center w-full max-w-md my-10 gap-3">
            <div className="flex-grow h-px bg-[#98EAF3]"></div>
            <span className="mx-4 text-[#98EAF3] font-medium text-2xl">Ou</span>
            <div className="flex-grow h-px bg-[#98EAF3]"></div>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="bg-[#FFFFFF] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            <img src="src/assets/Google_Favicon_2025.svg" alt="google logo" className="mr-2 w-6 h-6" />
            Continuer avec Google
          </button>

          <h2>
            Pas de Compte ?<Link to="/singin" className="text-[#98EAF3]"> Inscrivez-vous</Link>
          </h2>
        </form>

        {popupMsg && (
          <PopUp
            message={popupMsg}
            Btn={popupBtn}
            setPopupIsDisplayed={closePopup as any}
            isLoading={isLoading}
            mode={popupMode}
          />
        )}
      </div>
    </PageTransition>
  );
}
