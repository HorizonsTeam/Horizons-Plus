
import { Link } from 'react-router-dom';
import PageTransition from '../../features/connexion/pageTransitions';




export default function Singin() {
  return (
        <PageTransition>
    
    <div className="text-center min-h-screen flex flex-col mt-10 -mb-40 gap-6">
        <h1 className="text-4xl font-bold   text-[#98EAF3]">
            Crée un Compte
        </h1>

         <div className="flex flex-col items-center  mt-12 space-y-4">
            <div className="flex items-center justify-center  gap-4">                <input
                    type="text"
                    placeholder="Prénom"
                    className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
                />
                <input type="text"
                placeholder="nom"
                className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition" />
            </div>
            <input 
                type="text"
                placeholder="e-mail"
                className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
            />
            <input
                type="password"
                placeholder="Mot de passe"
                className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition"
            />
            <input type="password"  
                placeholder="Confirmer le mot de passe"
                className="w-full max-w-md bg-[#2C474B] text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#98EAF3] transition mb-10" 
                />
            <button className="bg-[#98EAF3] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold -mb-3">
                Se Connecter
            </button>
            <div className="flex items-center justify-center w-full max-w-md my-10 mb-17 gap-3">
            <div className="flex-grow h-px bg-[#98EAF3]"></div>
                <span className="mx-4 text-[#98EAF3] font-medium text-2xl">
                    Ou
                </span>
            <div className="flex-grow h-px bg-[#98EAF3]"></div>
        </div>
            <button className="bg-[#FFFFFF] text-[#115E66] w-full h-10 rounded-lg max-w-md font-bold flex items-center justify-center  mb-10 -mt-10 gap-2">
                <img src="src/assets/Google_Favicon_2025.svg" alt="google logo" className="mr-2 w-6 h-6"/>
                Continuer avec Google
            </button>
            <h2>Déja un compte ? <Link to="/login" className="text-[#98EAF3]">Connectez-vous</Link> </h2>

        </div>

    </div>
    </PageTransition>
    
  );
}
