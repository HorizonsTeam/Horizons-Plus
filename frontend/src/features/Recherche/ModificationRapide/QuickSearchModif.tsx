

import { useState } from "react";
type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    containerClassName?: string;
    inputValue?: string | number; 

};


type ModificationProps =
{
    villeDepart : string ;
    villeArrive : string ;
    Passagers : number ;
    dateSearch : string ; 
    BoxIsOn : boolean ;
    setBoxIsOn : (value : boolean) => void ;
    onValidate: (newValues: {
            fromName: string;
            toName: string;
            passagers: number;
            departureDate: string;
        }) => void;

}


function FloatingInput({ label, containerClassName = "", className = "", inputValue, ...props }: Props) {
    return (
        <div className={`relative ${containerClassName} `}>
            <input
                {...props}
                placeholder=" "                       
                className={[
                    "peer h-18 w-full rounded-xl bg-[#103035] px-4 mt-2 text-white outline-none",
                    "placeholder-transparent ring-1 ring-transparent",
                    "focus:ring-2 focus:ring-cyan-400",
                    className,
                ].join(" ")}
                value={inputValue}

            />
            <label
                className={[
                    "pointer-events-none absolute left-4 top-1 -translate-y-1/2",
                    "text-gray-400 transition-all duration-150",
                    "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-cyan-300",
                    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
                    "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs mt-2 ",
                ].join(" ")}

            >
                {label}
            </label>
        </div>
    );
}
export default function QuickModificationOverlay({villeDepart,villeArrive,Passagers,dateSearch,BoxIsOn,setBoxIsOn,onValidate}: ModificationProps) {

    let Ischanged = false ; 
    
    const [newVilleDepart, setNewVilleDepart] = useState(villeDepart);
    const [newVilleArrive, setNewVilleArrive] = useState(villeArrive);
    const [newPassagers, setNewPassagers] = useState(Passagers);
    const [newDateSearch, setNewDateSearch] = useState(dateSearch);

    const handleValidation = () => {
        onValidate({
            fromName: newVilleDepart,
            toName: newVilleArrive,
            passagers: newPassagers,
            departureDate: newDateSearch
        });

        setBoxIsOn(false);
    };


    return (
        <div className={`
        fixed bottom-0 left-0 w-full  bg-[#133A40]  rounded-t-4xl 
        transition-all duration-500 h-95  p-4 max-w-150
        ${BoxIsOn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
    `}>


            <div className="grid  grid-cols  justify-center gap-2 mt-4  ">
            <div className="flex justify-center gap-5 ">
                <FloatingInput
                label="Ville départ"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                inputValue={newVilleDepart}
                onChange={(e) => setNewVilleDepart(e.target.value)}
                

                
            />
             <FloatingInput
                label="Ville arrivée"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                inputValue={newVilleArrive}
                onChange={(e) => setNewVilleArrive (e.target.value)}
                

            />
                </div>

                <FloatingInput
                    label="Nombre de passagers"
                    type="Number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    inputValue={newPassagers}
                    onChange={(e) => setNewPassagers(Number (e.target.value))}
                    
                />
                <FloatingInput
                    label="Numéro de carte"
                    type="Date"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    inputValue={newDateSearch}
                    onChange={(e) => setNewDateSearch(e.target.value)}
                    
                />
                <button className="w-full  h-15 bg-[#98EAF3] rounded-xl mt-4" onClick={() => handleValidation()}>
                    <span className="text-[#115E66] font-bold text-xl">Valider les modifications </span>
                </button>  
            
            </div>
                      

        </div>
    );

}