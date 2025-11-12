
import ecoIco from '../../../../assets/ecoIco.webp';
import comfort_ico from '../../../../assets/comfort_eco.svg';
import business_ico from '../../../../assets/business_ico.svg';
import premiere_ico from '../../../../assets/premiere_ico.svg';
import ecoIco_slected from '../../../../assets/ecoIco.svg';
import comfort_ico_selected from '../../../../assets/comfort_eco_selected.webp';
import business_ico_selected from '../../../../assets/business_ico_selected.webp';
import premiere_ico_selected from '../../../../assets/premiere_ico_selected.webp';




type Props = 
{
    name: string ;
    description : string ; 
    selected: boolean ; 
    
}



export default function ClassCard ({name, description,selected} : Props)
{
    const getIcon = () => {
        switch (name.toLowerCase()) {
            case 'eco':
                return !selected ? ecoIco :ecoIco_slected ;
            case 'confort':
                return !selected ? comfort_ico : comfort_ico_selected;
            case 'business':
                return !selected ?   business_ico : business_ico_selected;
            case 'première':
                return !selected ?  premiere_ico : premiere_ico_selected;
            default:
                return  !selected ? ecoIco : ecoIco_slected;
        }
    };
    return (
        <div className={`w-80 h-20 bg-[#103035] position-relative rounded-2xl border-2 
        ${selected ? 'border-[#98EAF3]':'border-[#2C474B]'}
        `}
         >
            <div className="flex items-center gap-4 p-2">
                <img src={getIcon()} alt={name} className="w-8 h-8" />

                <div>
                    <p className={`text-left font-bold ${selected ? 'text-[#98EAF3]':'text-white'}`} >{name}</p>
                    <p className={`text-left text-xs font-md text-opacity-10 ${selected ? 'text-[#98EAF3]':'text-white'} text-opacity-10 `} >{description}</p>
                </div>
                

            </div>
        </div>
        
    );


}