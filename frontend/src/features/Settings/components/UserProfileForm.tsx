import useIsMobile from "../../../components/layouts/UseIsMobile";



export default function UserProfileForm() {
    const isMobile = useIsMobile ();


    return (
        <div className="w-full p-4">
            <div className={`border-b-2 border-b-[#4A6367] flex justify-between items-center  h-20 px-2 pb-2`}>
                <p className="text-xl font-semibold">Photo de profil</p>

                <label className="bg-transparent border-3 border-white text-white px-3 py-1 rounded-xl cursor-pointer hover:bg-white hover:text-black transition">
                    Importer
                    <input type="file" className="hidden" />
                </label>
            </div>
            <div className={`border-b-2 border-b-[#4A6367] flex ${isMobile ? 'w-80': 'w-full' }justify-between gap-20 items-center h-30 px-2 py-5 pb-2`}>
                <p className="text-xl w-30 font-semibold">Prénom</p>
                <input type="text" className={`w-full bg-[#2C474B] ${isMobile && 'min-w-30 max-w-40'} h-15 p-4 rounded-xl `}>

                </input>

                
            </div>
            <div className={`border-b-2 border-b-[#4A6367] flex ${isMobile ? 'w-80': 'w-full' }justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2`}>
                <p className="text-xl w-30 font-semibold">Nom</p>
                <input type="text" className={`w-full bg-[#2C474B] ${isMobile && 'min-w-30 max-w-40'} h-15 p-4 rounded-xl `}>

                </input>


            </div>
            <div className={`border-b-2 border-b-[#4A6367] flex ${isMobile ? 'w-80': 'w-full' }justify-between gap-18 items-center w-full h-30 px-2 py-5 pb-2`}>
                <p className="text-xl  w-25 font-semibold">Date de naissance</p>
                <input type="text" className={`w-full bg-[#2C474B] ${isMobile && 'min-w-30 max-w-40'} h-15 p-4 rounded-xl `}>

                </input>

                
            </div>
            <div className={` flex ${isMobile ? 'w-80': 'w-full' }justify-between gap-20 items-center w-full h-30 px-2 py-5 pb-2`}>
                <p className="text-xl w-30 font-semibold">Numéro</p>
                <input type="text" className={`w-full bg-[#2C474B] ${isMobile && 'min-w-30 max-w-40'} h-15 p-4 rounded-xl `}>

                </input>


            </div>
        </div>
    );
}
