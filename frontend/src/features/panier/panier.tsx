import ReturnBtn from '../../assets/ReturnBtn.svg';
import Planecard from './ProductCards/Plane'
import Traincard from './ProductCards/Train'
import { useEffect } from 'react';

const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

export default function Panier () {
    // useEffect(() => {
    //     async function fetchPanier() {
    //         const sessionId = "GFNZwz0yxqSQ9EyWsjPfIMpqjOA5ab4D";
    //         const res = await fetch(`${base}/api/panier/${sessionId}`);
    //         const data = await res.json();
    //         console.log("Panier data:", data);
    //     }

    //     fetchPanier();
    // }, []);
    
    useEffect(() => {
        async function fetchPanier() {
            const sessionId = localStorage.getItem("session_id");

            const res = await fetch(`${base}/api/panier`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            });

            const data = await res.json();

            localStorage.setItem("session_id", data.sessionId);
            console.log("Panier data:", data);
        }

        fetchPanier();
    })

    return (
        <>
        <div className='relative mt-4'>
        <img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' />
        < h1 className='text-3xl text-[#98EAF3] font-bold text-center'>Panier</h1>
        </div>
            <Traincard/>
            <Planecard/>
        </>

    )
}   



