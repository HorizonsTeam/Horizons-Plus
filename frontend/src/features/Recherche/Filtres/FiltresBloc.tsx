import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";
import MultipleSelectPlaceholder from "../../../components/AdditionalsComponents/OptionSelector";
import Checkbox from "../../../components/AdditionalsComponents/Checkbox";
import useIsMobile from "../../../components/layouts/UseIsMobile";
import Close from "../../../assets/close.svg";

export type StopType = "Tout type" | "Direct" | "Correspondance" ;
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
  resetFilters: () => void;
  setFiltreMobileIsOn?: React.Dispatch<React.SetStateAction<boolean>>;
  Isloading?: boolean;
};

export default function FiltreBloc({
  stopType,
  setStopType,
  setPriceOption,
  setTimedeparturOption,
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
  resetFilters,
  setFiltreMobileIsOn,
  Isloading ,
}: FiltreBlocProps) {
  const isMobile = useIsMobile();

  

  return (
    <div
      className={[
        "w-full  rounded-lg flex max-w-120  shadow-2xl relative overflow-hidden",
        Isloading ? "bg-[#2C474B] pointer-events-none" : "bg-[#0C2529] ",
        isMobile
          ? "h-full m-0 rounded-none max-w-none "
          : "max-h-240 overflow-y-auto overscroll-contain",

        Isloading
          ? "after:content-[''] after:absolute after:inset-0 after:translate-x-[-100%] after:animate-[shimmer_1.2s_infinite] " +
          "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent"
          : "",
      ].join(" ")}

    >
      <div
        className={[

          "w-full",
          isMobile
            ? " overflow-y-auto overscroll-contain h-full"
            : "",
            Isloading ? "opacity-0 " : "",
        ].join(" ")}
      >
        {/* Header */}
        <div
          className={[
            "border-b-2 border-[#98EAF3] p-4 flex items-center z-80 max-w-full",
            isMobile ? "justify-between sticky top-0 bg-[#0C2529] mt-15" : "justify-center ",
          ].join(" ")}
        >
          <p className="text-2xl text-primary font-semibold">Filtres</p>

          {isMobile && (
            <button 
              type="button"
              className="text-xl font-bold px-4 py-2  text-white rounded-full cursor-pointer"
              onClick={() => { setFiltreMobileIsOn?.(false); }}
            >
              <img src={Close} alt="" className="h-10 w-10"/>
            </button>
          )}
        </div>

        {/* Escales */}
        <div
          className={[
            "w-full flex items-center justify-between",
            isMobile ? "py-4 px-4" : "py-6 p-6",
          ].join(" ")}
        >
          <p className="text-xm font-bold">Tout type de trajet ? </p>

          <div className={["w-full flex justify-end", isMobile ? "mr-0" : "mr-6"].join(" ")}>
            <TripTypeSwitch<StopType>
              value={stopType || "Tout type"}
              onChange={(v) => setStopType?.(v)}
              a="Direct"
              b="Tout type"
              label=" Avec et sans Escales"

            />

          </div>
        </div>

        {/* Prix + Horaires */}
        <div className={isMobile ? "px-4 pb-2" : "p-4"}>
          <div
            className={[
              "w-full flex items-center justify-between border-b-2 border-[#2C474B]",
              isMobile ? "py-3 px-0" : "py-4 p-4",
            ].join(" ")}
          >
            <div className={isMobile ? "" : "mt-3"}>
              <p className="text-xl font-bold">Prix</p>
            </div>

            <MultipleSelectPlaceholder
              options={["Prix croissant", "Prix décroissant"]}
              Placeholder="Veuillez choisir un mode"
              Onchange={(v: string) => setPriceOption?.(v)}
            />
          </div>

          <div
            className={[
              "w-full",
              isMobile ? "grid gap-2 pt-4" : "py-6 p-4 text-xl flex items-center justify-between",
            ].join(" ")}
          >
            <div className={isMobile ? "mb-2" : "mt-3"}>
              <p className="font-bold">Horaires</p>
            </div>

            <div className={isMobile ? "grid gap-2" : "grid"}>
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

        {/* Espaces */}
        <div className={isMobile ? "w-full grid gap-6 px-4 pb-28" : "w-full grid gap-8 py-4 px-8"}>
          <div className={isMobile ? "" : "mt-3"}>
            <p className="font-bold text-xl">Espaces</p>
          </div>

          <div className={isMobile ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-4"}>
            <Checkbox label="Vélo" checked={!!hasBike} onChange={() => setHasBike?.((prev) => !prev)} />
            <Checkbox label="Animaux" checked={!!hasAnimal} onChange={() => setHasAnimal?.((prev) => !prev)} />
            <Checkbox label="Wi-Fi" checked={!!hasWifi} onChange={() => setHasWifi?.((prev) => !prev)} />
            <Checkbox label="Restauration" checked={!!hasFood} onChange={() => setHasFood?.((prev) => !prev)} />
            <Checkbox label="Train de nuit" checked={!!isNightTrain} onChange={() => setIsNightTrain?.((prev) => !prev)} />
          </div>
        </div>

        <div
          className={[
            "w-full flex justify-between border-t-2 border-primary p-6",
            isMobile ? "fixed bottom-0 left-0 right-0 bg-[#0C2529] z-90 p-4" : "mt-15",
          ].join(" ")}
        >
          <button
            className={[
              "text-sm font-bold bg-[#FFB856] text-secondary rounded-lg hover:bg-[#C28633] transition-all duration-300 cursor-pointer",
              isMobile ? "px-3 py-3 w-[48%]" : "p-2",
            ].join(" ")}
            onClick={() => {resetFilters(); setFiltreMobileIsOn?.(false); window.scrollTo(0, 0);}}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
