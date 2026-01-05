import { useNavigate } from 'react-router-dom';
import ReturnBtn from '../../assets/ReturnBtn.svg';
import UserIco from '../../assets/userIco.svg'
import ParametresIco from '../../assets/Parametres_Ico.svg'
import PaiementIco from '../../assets/PaiementIco.svg'
import PreferenceIco from '../../assets/PreferencesIco.svg'
import NotificationIco from '../../assets/NotificationsIco.svg'
import SecuIco from '../../assets/SecuIco.svg'
import useIsMobile from '../../components/layouts/UseIsMobile';
import UserProfileForm from './components/UserInformation/UserProfileForm';
import { useState } from 'react';
import UserAdressForm from './components/UserInformation/UserAdressForm';
import AccountSettings from './Pages/AccountSettings/AccountSettings';





export default function Setings ()
{
    const [selectedsetting, setSelectedsetting] = useState('ProfilInfo');
    const [profileInfoDesplay , setProfileInfoDesplay] = useState(true);
    const [AdresseInfoDesplay , setAdresseInfoDesplay] = useState(false);


     let informationProfile : boolean = false 
    if (profileInfoDesplay || AdresseInfoDesplay)
    { 
        informationProfile = true


    }
    const isMobile = useIsMobile();
    const navigate = useNavigate();
        const handleretour = () =>
        {
            navigate(-1);
        };
    return (
        <>
            <div className={` ${isMobile ? 'w-full flex justify-center' : 'w-full flex justify-start gap-5 p-4  '}`}>
                <div className={`w-full ${!isMobile && 'max-w-100'  }`   }>
                    <div className='relative mt-4 display flex justify-center items-center m-2'>
                        <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className={`absolute left-1 mt-5 transform -translate-y-1/2 ${isMobile && 'max-w-10 '  }`  }/></button>
                        < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Paramètres</h1>
                    </div>

                    <div className='w-full px-4  mt-15 '>
                        <div className={`w-full grid grid-cols    `}>
                            <button className='  border-b-2 border-[#2C474B] h-20 w-full'>
                                <button className='w-full flex justify-start gap-4' onClick={() => { if (isMobile) {navigate("/UserInfoPageMobile")  } else { setSelectedsetting("ProfilInfo")}}}>
                                <img src={UserIco} alt="" className='h-6 w-8' />
                                    <p className={` font-bold ${selectedsetting === 'ProfilInfo' && !isMobile ? 'text-[#98EAF3] text-2xl transition-colors duration-300' : 'text-xl'}`}>Informations du profil</p>
                                </button>
                            </button>
                            <button className='  w-full border-b-2 border-[#2C474B] h-20  '>
                                <div className='w-full flex justify-start gap-4' onClick={() =>{ if (isMobile) {
                                    navigate("/AccountSettings");
                                }else
                                    {
                                        setSelectedsetting('AccountSettings');



                                    } 
                            }}>
                                    <img src={ParametresIco} alt="" className='h-6 w-8' />
                                    <p className={` font-bold ${selectedsetting === 'AccountSettings'&& !isMobile ?'text-[#98EAF3] text-2xl transition-colors duration-300' : 'text-xl'}`}>Paramètres du compte</p>
                                </div>
                            </button><button className='  w-full border-b-2 border-[#2C474B] h-20 w-80 '>
                                <div className='w-full flex justify-start gap-4'>
                                    <img src={PreferenceIco} alt="" className='h-6 w-8' />
                                    <p className='text-xl font-bold '>Préférences</p>
                                </div>
                            </button><button className='w-full  border-b-2 border-[#2C474B] h-20 w-80 '>
                                <div className='w-full flex justify-start gap-4'>
                                    <img src={PaiementIco} alt="" className='h-6 w-8' />
                                    <p className='text-xl font-bold '>Paiements</p>
                                </div>
                            </button><button className=' w-full border-b-2 border-[#2C474B] h-20 w-80 '>
                                <div className='w-full flex justify-start gap-4'>
                                    <img src={NotificationIco} alt="" className='h-6 w-8' />
                                    <p className='text-xl font-bold '>Notifications</p>
                                </div>
                            </button>
                            <button className=' w-full h-20 w-80 '>
                                <div className='w-full flex justify-start gap-4'>
                                    <img src={SecuIco} alt="" className='h-6 w-8' />
                                    <p className='text-xl font-bold '>Sécurité</p>
                                </div>
                            </button>

                            <button className="mt-10 h-15 bg-[#FFB856] text-[#115E66] font-semibold px-4 py-2 rounded-xl">
                                Déconnexion
                            </button>
                        </div>

                    </div>
                    
                </div>
                {!isMobile && selectedsetting === 'ProfilInfo' &&
                    <div className='  w-full m-4 '>
                        <div className='flex w-full justify-center h-20 mt-10'>
                            <button className={`w-full  text-2xl font-semibold border-b-4 rounded-tr-3xl transition-colors duration-300 ${!profileInfoDesplay ? 'bg-transparent border-b-white ' : 'bg-[#133A40] text-[#98EAF3] border-b-[#98EAF3]'  }`} 
                                onClick={ () => {
                                    setProfileInfoDesplay(true); 
                                    setAdresseInfoDesplay (false)
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
                }
                {!isMobile && selectedsetting === 'AccountSettings' &&
                    <div className=' w-full m-4 '>
                        <AccountSettings/>


                </div>
}


            </div>
        </>
    );
}