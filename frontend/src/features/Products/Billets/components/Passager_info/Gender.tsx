
type Props = {
    value: string;
    IsSelected : boolean;
    onClick : () => void;
};


export default function Gender_Selection({value, IsSelected, onClick}: Props) {
    return (
        <div>
            <button className={`w-22 h-10  bg-[#103035] rounded-2xl ml-3 border-3 cursor-pointer ${IsSelected ? 'border-[#98EAF3]' : 'border-[#2C474B]' } text-white display flex justify-between p-2`} onClick={onClick} >
                <span className={`font-bold text-xs  ${IsSelected ? 'text-[#98EAF3]' : 'text-white' }`} >{value}</span>
                <div className={`h-2 w-2  rounded-xl mt-1 ${IsSelected ?  'bg-[#98EAF3]' : 'bg-white' }`}></div>

            </button>
        </div>
    );
}