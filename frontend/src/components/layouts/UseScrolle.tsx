import { useEffect, useState } from "react";

export default function useIsScrolling(delay = 150): boolean {
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const onScroll = () => {
            setIsScrolling(true);

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsScrolling(false);
            }, delay);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            clearTimeout(timeoutId);
        };
    }, [delay]);

    return isScrolling;
}
