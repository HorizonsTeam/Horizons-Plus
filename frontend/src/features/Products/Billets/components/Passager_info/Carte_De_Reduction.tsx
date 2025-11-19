import CarteSelect from "./MiniSelect";
//import closeSVG from "../../../../../assets/CloseSVG.svg"

type props = {
    fermer: () => void;
};

export default function CarteReduction({ fermer }: props) {

    return (
        <div className="space-y-5" >

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-white font-bold ">Carte de réduction / abonnement</h1>

                <button
                    className="text-white text-xl font-bold px-3 py-1  rounded-lg" onClick={fermer}>
                    {/*  <img src={closeSVG} alt="Close" className="h-6 w-6" />*/}
                </button>
            </div>

            <div className="space-y-4">

                <div className="flex flex-col space-y-3">
                    <>
                    
                        <CarteSelect />
                    </>
                </div>

                <div className="flex flex-col space-y-5">
                    <label className="text-white text-sm">Numéro de la carte</label>
                    <input
                        type="text"
                        placeholder="Numéro (optionnel)"
                        className="h-10 rounded-md px-3 bg-[#103035] border-2 border-[#2C474B] text-white"
                    />
                </div>

                <div className="flex flex-col space-y-5">
                    <label className="text-white text-sm">Date d'expiration</label>
                    <input
                        type="date"
                        className="h-10 rounded-md px-3 bg-[#103035] border-2 border-[#2C474B] text-white"
                    />
                </div>
            </div>

            

        </div>
    );
}
