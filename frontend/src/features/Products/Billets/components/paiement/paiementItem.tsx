

type Props = {
    IsSelected: boolean;
    cardName: string;
    cardDescription: string;
    onClick: () => void;
    icone : string;
};

export default function ModeDePaiementItem({ IsSelected, cardName, cardDescription, onClick,icone }: Props) {
    return (
        <div
            onClick={onClick}
            className={`w-full h-20 rounded-xl p-4 text-left transition -ml-2 mb-2 border-3
        ${IsSelected ? "border-[#98EAF3] text-[#98EAF3]" : "border-[#2C474B] text-white"}
         hover:border-[#98EAF3]`}
        >
            <div className="flex display-center" style={{ pointerEvents: "none" }}>
                <div className="flex w-full gap-5">
                    <img src={icone} alt="" className='h-10 w-10 ' />
                    <div className="w-full grid grid-cols gap-2">
                        <p className="font-semibold">{cardName}</p>
                        <p className="text-[10px] opacity-80">{cardDescription}</p>
                    </div>
                </div>
                <div className={` h-7 w-7 mt-2 rounded-3xl border-3 border-[#2C474B] ${IsSelected && 'bg-[#98EAF3]'}`}>

                </div>
            </div>
        </div>
    );
}