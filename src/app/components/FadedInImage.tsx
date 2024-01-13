"use client";

import Image from "next/image";

export default function FadedInImage(
    props: React.ComponentProps<typeof Image> & {
        duration?: number;
        delay?: number;
    }
) {
    const { duration, delay, style } = props;

    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
            {...props}
            className={`transition-opacity opacity-0 ease-in-out ${props?.className}`}
            style={{
                transitionDuration: `${duration ?? 1000}ms`,
                transitionDelay: `${delay ?? 0}ms`,
                ...style,
            }}
            onLoadingComplete={(image) => image.classList.remove("opacity-0")}
        />
    );
}
