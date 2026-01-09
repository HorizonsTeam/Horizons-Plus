import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";
import MultipleSelectPlaceholder from "../../../components/AdditionalsComponents/OptionSelector";
import Checkbox from "../../../components/AdditionalsComponents/Checkbox";

export type StopType = "direct" | "correspondance" | undefined;

type FiltreBlocProps = {
  stopType?: StopType;
  setStopType?: (v: StopType) => void; 
  priceOption?: string;
  setPriceOption?: (v: string) => void;

  timeDeparturOption?: string;
  setTimedeparturOption?: (v: string) => void;

  timeArrivalOption?: string;
  setTimeArrivalOption?: (v: string) => void;
  hasBike?: boolean;
  setHasBike?: React.Dispatch<React.SetStateAction<boolean>>;
  hasAnimal?: boolean;
  setHasAnimal?: React.Dispatch<React.SetStateAction<boolean>>;
  hasWifi?: boolean;
  setHasWifi?: React.Dispatch<React.SetStateAction<boolean>>;
  hasFood?: boolean;
  setHasFood?: React.Dispatch<React.SetStateAction<boolean>>;
  isNightTrain?: boolean;
  setIsNightTrain?: React.Dispatch<React.SetStateAction<boolean>>;

  onUpdateFilters?: () => void;
};

export default function FiltreBloc({
  stopType,
  setStopType,
  priceOption,
  setPriceOption,
  timeDeparturOption,
  setTimedeparturOption,
  timeArrivalOption,
  setTimeArrivalOption,
  hasBike,
  setHasBike,
  hasAnimal,
  setHasAnimal,
  hasWifi,
  setHasWifi,
  hasFood,
  setHasFood,
  isNightTrain,
  setIsNightTrain,
  onUpdateFilters,
}: FiltreBlocProps) {


  const updateFilters = () => {
    onUpdateFilters?.();
    console.log({
      stopType,
      priceOption,
      timeDeparturOption,
      timeArrivalOption,
      hasBike,
      hasAnimal,
      hasWifi,
      hasFood,
      isNightTrain,
    });
  };

  return (
    <div className="w-full bg-[#0C2529] mb-5 rounded-lg flex max-w-120 mt-10 h-auto">
      <div className="w-full">
        <h1 className="border-b-2 border-[#98EAF3] p-4">
          <p className="text-2xl text-primary font-semibold">Filtres</p>
        </h1>

        <div className="w-full flex items-center justify-between py-6 p-6">
          <p className="text-xl font-bold">Escales</p>

          <div className="w-full flex justify-end mr-6">
            <TripTypeSwitch
              value={stopType ?? "direct"}
              onChange={setStopType ?? (() => { })}
              a="direct"
              b="correspondance"
              label="Correspondances"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="w-full flex items-center justify-between py-4 p-4 border-b-2 border-[#2C474B]">
            <div className="mt-3">
              <p className="text-xl font-bold">Prix</p>
            </div>

            <MultipleSelectPlaceholder
              options={["Prix croissant", "Prix décroissant"]}
              Placeholder="Veuillez choisir un mode"

              Onchange={(v: string) => setPriceOption?.(v)}
            />
          </div>

          <div className="w-full flex items-center justify-between py-4 p-4">
            <div className="mt-3">
              <p className="text-xl font-bold">Horaires</p>
            </div>

            <div className="grid">
              <MultipleSelectPlaceholder
                options={["Matin", "Après-midi", "Soir"]}
                Placeholder="Départ"
                Onchange={(v: string) => setTimedeparturOption?.(v)}
              />
              <MultipleSelectPlaceholder
                options={["Matin", "Après-midi", "Soir"]}
                Placeholder="Arrivée"
                Onchange={(v: string) => setTimeArrivalOption?.(v)}
              />
            </div>
          </div>
        </div>

        <div className="w-full grid gap-8 py-4 px-8">
          <div className="mt-3">
            <p className="font-bold text-xl">Espaces</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Checkbox
              label="Vélo"
              checked={!!hasBike}
              onChange={() => setHasBike?.((prev) => !prev)}
            />
            <Checkbox
              label="Animaux"
              checked={!!hasAnimal}
              onChange={() => setHasAnimal?.((prev) => !prev)}
            />
            <Checkbox
              label="Wi-Fi"
              checked={!!hasWifi}
              onChange={() => setHasWifi?.((prev) => !prev)}
            />
            <Checkbox
              label="Restauration"
              checked={!!hasFood}
              onChange={() => setHasFood?.((prev) => !prev)}
            />
            <Checkbox
              label="Train de nuit"
              checked={!!isNightTrain}
              onChange={() => setIsNightTrain?.((prev) => !prev)}
            />
          </div>

          <button onClick={updateFilters}>Appliquer les filtres</button>
        </div>
      </div>
    </div>
  );
}
