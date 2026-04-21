import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../pageTransitions';
import type React from 'react';
import { authClient } from '../../../lib/auth-clients';
import { useState } from 'react';
import useIsMobile from '../../../components/layouts/UseIsMobile';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { signupSchema, type SignupValues } from '../signup-validation';
import { flattenErrors, type FieldErrors } from '../validation-shared';

const API_BASE = import.meta.env.VITE_API_URL || "";

type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirm: string;
};

const initialForm: FormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
};

export default function Singin() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [form, setForm] = useState<FormState>(initialForm);
    const [isloading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignupValues>>({});
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        password: false,
        confirm: false,
    });

    const revalidate = (next: FormState) => {
        const parsed = signupSchema.safeParse(next);
        setFieldErrors(parsed.success ? {} : flattenErrors<SignupValues>(parsed.error));
    };

    const shouldShow = (field: keyof FormState) => (submitted || touched[field]) && !!fieldErrors[field];

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            if (submitted || touched[key]) revalidate(next);
            return next;
        });
    };

    const onBlur = (field: keyof FormState) => {
        setTouched((t) => ({ ...t, [field]: true }));
        revalidate(form);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        setSubmitted(true);

        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
            setFieldErrors(flattenErrors<SignupValues>(parsed.error));
            return;
        }
        setFieldErrors({});

        setIsLoading(true);
        try {
            const signUp = await authClient.signUp.email({
                name: `${parsed.data.firstName} ${parsed.data.lastName}`.trim(),
                email: parsed.data.email,
                password: parsed.data.password,
                callbackURL: "/",
            });

            if (signUp?.error) {
                setServerError(
                    signUp.error.code === "USER_ALREADY_EXISTS"
                        ? "Un compte existe déjà avec cet email."
                        : signUp.error.message || "Erreur lors de la création du compte."
                );
                return;
            }

            const signIn = await authClient.signIn.email({
                email: parsed.data.email,
                password: parsed.data.password,
                callbackURL: "/",
            });

            if (signIn?.error) {
                setServerError(signIn.error.message || "Compte créé, mais connexion impossible.");
                return;
            }

            await fetch(`${API_BASE}/api/user/phone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ phone: parsed.data.phone }),
            });

            navigate("/");
        } catch (err: any) {
            setServerError(err?.message || "Erreur lors de la création du compte.");
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = () => authClient.signIn.social({ provider: "google", callbackURL: "/" });

    const inputClass = "w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition";
    const errorClass = "w-full max-w-md text-left text-sm text-red-300 -mt-2";

    return (
        <PageTransition>
            <div className={`text-center min-h-screen flex flex-col mt-17 lg:mt-13  gap-6 ${isMobile ? 'w-full px-4' : 'w-full'} `}>
                <h1 className="text-4xl font-bold   text-[#98EAF3]">
                    Créer un Compte
                </h1>

                <form onSubmit={handleSubmit} noValidate className='flex flex-col items-center mt-1  space-y-4'>
                    {serverError && (
                        <div className="w-full max-w-md bg-red-600/20 text-red-200 p-3 rounded">
                            {serverError}
                        </div>
                    )}

                    <div className="flex flex-col items-center  space-y-4">
                        <div className="flex items-center justify-center  gap-4">
                            <div className="flex flex-col w-full">
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    value={form.firstName}
                                    onChange={(e) => setField("firstName", e.target.value)}
                                    onBlur={() => onBlur("firstName")}
                                    className={inputClass}
                                    aria-invalid={shouldShow("firstName")}
                                />
                                {shouldShow("firstName") && <p className={errorClass}>{fieldErrors.firstName}</p>}
                            </div>
                            <div className="flex flex-col w-full">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={form.lastName}
                                    onChange={(e) => setField("lastName", e.target.value)}
                                    onBlur={() => onBlur("lastName")}
                                    className={inputClass}
                                    aria-invalid={shouldShow("lastName")}
                                />
                                {shouldShow("lastName") && <p className={errorClass}>{fieldErrors.lastName}</p>}
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            onBlur={() => onBlur("email")}
                            className={inputClass}
                            aria-invalid={shouldShow("email")}
                        />
                        {shouldShow("email") && <p className={errorClass}>{fieldErrors.email}</p>}

                        <div className="w-full max-w-md">
                            <PhoneInput
                                defaultCountry="FR"
                                value={form.phone}
                                onChange={(v) => setField("phone", v ?? "")}
                                onBlur={() => onBlur("phone")}
                                placeholder="Numéro de téléphone"
                                className="PhoneInput"
                            />
                            {shouldShow("phone") && <p className={errorClass}>{fieldErrors.phone}</p>}
                        </div>

                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={form.password}
                            onChange={(e) => setField("password", e.target.value)}
                            onBlur={() => onBlur("password")}
                            className={inputClass}
                            aria-invalid={shouldShow("password")}
                        />
                        {shouldShow("password") && <p className={errorClass}>{fieldErrors.password}</p>}

                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={form.confirm}
                            onChange={(e) => setField("confirm", e.target.value)}
                            onBlur={() => onBlur("confirm")}
                            className={`${inputClass} mb-10`}
                            aria-invalid={shouldShow("confirm")}
                        />
                        {shouldShow("confirm") && <p className={errorClass}>{fieldErrors.confirm}</p>}

                        <button
                            type='submit'
                            disabled={isloading}
                            className="bg-[#98EAF3] text-[#115E66] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 w-full h-10 rounded-lg max-w-md font-bold -mb-3">
                            {isloading ? "Création..." : "Créer un compte"}
                        </button>

                        <div className="flex items-center justify-center w-full max-w-md my-10 mb-17 gap-3">
                            <div className="flex-grow h-px bg-[#98EAF3]"></div>
                            <span className="mx-4 text-[#98EAF3] font-medium text-2xl">Ou</span>
                            <div className="flex-grow h-px bg-[#98EAF3]"></div>
                        </div>

                        <button
                            type='button'
                            onClick={signInWithGoogle}
                            className="bg-[#FFFFFF] text-[#115E66] cursor-pointer w-full h-10 rounded-lg max-w-md font-bold flex items-center justify-center  mb-10 -mt-10 gap-2">
                            <img src="src/assets/Google_Favicon_2025.svg" alt="google logo" className="mr-2 w-6 h-6" />
                            Continuer avec Google
                        </button>
                        <h2>Déjà un compte ? <Link to="/login" className="text-[#98EAF3]">Connectez-vous</Link> </h2>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
}
