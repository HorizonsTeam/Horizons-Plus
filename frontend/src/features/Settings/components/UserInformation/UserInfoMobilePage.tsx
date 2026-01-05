import { useState } from 'react';
import UserProfileForm from '../../components/UserInformation/UserProfileForm';
import UserAdressForm from './UserAdressForm';
import ReturnBtn from '../../../../assets/ReturnBtn.svg'
import { useNavigate } from 'react-router-dom';


export default function UserInfoPageMobile ()
{
    const Navigate = useNavigate()
    const handleRetour = ()=>
    {
        Navigate(-1);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    }
    const [profileInfoDesplay, setProfileInfoDesplay] = useState(true);
    const [AdresseInfoDesplay, setAdresseInfoDesplay] = useState(false);
    return (
        <div className='  w-full p-2 '>

            <div className=' flex justify-start gap-3 mt-2' onClick={()=>handleRetour()}>
                <img src={ReturnBtn} alt=""  className='h-10 w-10'/>
                <p className='text-xl font-bold mt-2 text-primary' >Retour</p>

            </div>

                                <div className='flex w-full justify-center h-20 mt-10 '>
                                    <button className={`w-full  text-2xl font-semibold border-b-4 rounded-tr-3xl transition-colors duration-300 ${!profileInfoDesplay ? 'bg-transparent border-b-white ' : 'bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]'  }`} 
                                        onClick={ () => {   setProfileInfoDesplay(true); 
                                            setAdresseInfoDesplay (false);
                                        }}>Profil</button>
        
                                    <button className={` w-full text-2xl font-semibold border-b-4 rounded-tl-3xl transition-colors duration-300 ${!profileInfoDesplay ? 'bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]' : 'bg-transparent border-b-white ' }`} onClick={ () => {setProfileInfoDesplay(false); setAdresseInfoDesplay (true)}}>Adresse</button>
                                </div>
                                {
                                profileInfoDesplay && 
                                <div className='mt-20'>
                                    <UserProfileForm/>
        
                                </div>
                                }
        
                                {
                                AdresseInfoDesplay && 
                                <div className='mt-20'>
                                    <UserAdressForm/>
        
                                </div>
                                }
                                
        
                            </div>
    );
}

        