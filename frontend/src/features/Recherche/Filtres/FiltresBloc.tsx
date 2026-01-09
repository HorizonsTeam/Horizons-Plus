import { useState } from "react";
import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";
import MultipleSelectPlaceholder from "../../../components/AdditionalsComponents/OptionSelector";

export type StopType = "direct" | "correspondance";


export default function FiltreBloc() {
  const [stopType, setStopType] = useState<StopType>("direct");

  return (
    <div className="w-full bg-[#0C2529] mb-5 rounded-lg  flex max-w-150 mt-10 ">
      
      <div className="w-full">
        <h1 className="  border-b-2 border-[#98EAF3] p-4"> <p className="text-2xl text-primary font-semibold">Filtres </p></h1>
        
        <div className=" w-full flex  items-center justify-between  py-4  p-4">
          
          <p className=" ">Escales</p>

          <TripTypeSwitch
            value={stopType}
            onChange={setStopType}
            a="direct"
            b="correspondance"
            label="Correspondances"
          />
        </div>
        <div className="p-4">
        <p className="font-semibold text-xl ">Trier par</p>
        
          <div className=" w-full flex  items-center justify-between  py-4  p-4 border-b-2 border-[#2C474B]">
            <div className="mt-3">
            <p>Prix</p>
            </div>
            <MultipleSelectPlaceholder options={["Prix croissant", "Prix décroissant"]} Placeholder="veuillez choisir un mode " />
        </div>
          <div className=" w-full flex  items-center justify-between  py-4  p-4">
            <div className="mt-3">
              <p>Horraires </p>
            </div>
            <div className="grid ">
              <MultipleSelectPlaceholder options={["Matin", "Après-midi", "Soir"]} Placeholder="Départ" />
              <MultipleSelectPlaceholder options={["Matin", "Après-midi", "Soir"]} Placeholder="Arrivé" />


            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
}
