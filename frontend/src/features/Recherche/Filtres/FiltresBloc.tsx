import { useState } from "react";
import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";

export type StopType = "direct" | "correspondance";

export default function FiltreBloc() {
  const [stopType, setStopType] = useState<StopType>("direct");

  return (
    <div className="w-full bg-[#0C2529] mb-5 rounded-lg h-30 flex max-w-100 mt-10">
        <div>
              Escales
        </div>
      <TripTypeSwitch
        value={stopType}
        onChange={setStopType}
        a="direct"
        b="correspondance"
        label="Correspondances"
      />
    </div>
  );
}
