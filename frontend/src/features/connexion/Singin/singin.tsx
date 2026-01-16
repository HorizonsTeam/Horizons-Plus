import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../pageTransitions';
import type React from 'react';
import { authClient } from '../../../lib/auth-clients';
import { useState } from 'react';
import useIsMobile from '../../../components/layouts/UseIsMobile';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';



export default function Singin() {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState<string | undefined>(undefined)
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError(null);

        // Contraintes du mot de passe
        if (password.length < 8) {

            setError("Le mot de passe doit faire au moins 8 caractères.");
            return;
        }
        if (password !== confirm) {

            setError("Le mot ou les mots de passe ne correspondent pas.");
            return;
        }
        if (!phone || !isPossiblePhoneNumber(phone)) {
            setError("Numéro de téléphone invalide.");
            return;
        }

        setIsLoading(true);
        try {
            await authClient.signUp.email({
                name: `${firstName} ${lastName}`.trim(),
                email,
                password,
                callbackURL: "/", // Se diriger à l'accueil
            });

            // Autologin
            await authClient.signIn.email({
                email,
                password,
                callbackURL: "/"
                
            });

            await fetch("http://localhost:3005/api/user/phone", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify({ phone }),
            });

            navigate("/");

        } catch (err: any) {
            setError(err?.message || "Erreur lors de la création du compte.");
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = () => authClient.signIn.social({ provider: "google", callbackURL: "/" });




    return (
        <PageTransition>

            <div className={`text-center min-h-screen flex flex-col mt-17 lg:mt-13  gap-6 ${useIsMobile() ? 'w-full px-4' : 'w-full'} `}>
                <h1 className="text-4xl font-bold   text-[#98EAF3]">
                    Créer un Compte
                </h1>

                {/* Test */}
                <form onSubmit={handleSubmit} className='flex flex-col items-center mt-1  space-y-4'>
                    {error && (
                        <div className="w-full max-w-md bg-red-600/20 text-red-200 p-3 rounded">
                            {error}
                        </div>
                    )}


                    <div className="flex flex-col items-center  space-y-4">
                        <div className="flex items-center justify-center  gap-4">                <input
                            type="text"
                            placeholder="Prénom"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
                            required
                        />
                            <input type="text"
                                placeholder="Nom"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
                            required
                        />
                        <div className="w-full max-w-md">
                            <PhoneInput
                                defaultCountry="FR"
                                value={phone}
                                onChange={setPhone}
                                placeholder="Numéro de téléphone"
                                className="PhoneInput"
                                required
                            />
                        </div>

                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
                            required
                            minLength={8}
                        />
                        <input type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition mb-10"
                            required
                        />
                        <button
                            type='submit'
                            disabled={isloading}
                            className="bg-[#98EAF3] text-[#115E66] cursor-pointer w-full h-10 rounded-lg max-w-md font-bold -mb-3">
                            {isloading ? "Création..." : "Créer un compte"}
                        </button>

                        <div className="flex items-center justify-center w-full max-w-md my-10 mb-17 gap-3">
                            <div className="flex-grow h-px bg-[#98EAF3]"></div>
                            <span className="mx-4 text-[#98EAF3] font-medium text-2xl">
                                Ou
                            </span>
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