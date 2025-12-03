type Props = {
    avantage1?: string;
    Ico_path_Avantage1?: string;
    avantage2?: string;
    Ico_path_Avantage2?: string;
    avantage3?: string;
    Ico_path_Avantage3?: string;
    avantage4?: string;
    Ico_path_Avantage4?: string;
    avantage5?: string;
    Ico_path_Avantage5?: string;
    avantage6?: string;
    Ico_path_Avantage6?: string;
};



export default function Inclus(props: Props) {
    const avantages = [
        { label: props.avantage1, icon: props.Ico_path_Avantage1 },
        { label: props.avantage2, icon: props.Ico_path_Avantage2 },
        { label: props.avantage3, icon: props.Ico_path_Avantage3 },
        { label: props.avantage4, icon: props.Ico_path_Avantage4 },
        { label: props.avantage5, icon: props.Ico_path_Avantage5 },
        { label: props.avantage6, icon: props.Ico_path_Avantage6 },
    ].filter(item => item.label); // on garde seulement ceux définis

    return (
        <div className='w-full items-center   bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5 '>
                <div className='border-b-3 border-[#2C474B] '>
                    <p className='m-4 font-semibold '>Inclus</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5">
                    {avantages.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {item.icon && <img src={item.icon} alt={item.label} className="w-5 h-5" />}
                            <p className="text-white text-sm">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
    );
}
