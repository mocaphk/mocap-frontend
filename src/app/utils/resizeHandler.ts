import { useEffect } from "react";

const debounce = <F extends (...args: any[]) => void>(
    func: F,
    delay: number
): ((...args: Parameters<F>) => void) => {
    let timer: NodeJS.Timeout;

    return (...args: Parameters<F>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const useDebouncedResize = (callback: () => void, delay: number) => {
    useEffect(() => {
        const handleResize = debounce(callback, delay);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [callback, delay]);
};

export default useDebouncedResize;
