"use client";

import { Fade, Button } from "@mui/material";

export default function FadedInButton(
    props: React.ComponentProps<typeof Button> & {
        duration?: number;
        delay?: number;
    }
) {
    const { duration, delay } = props;

    return (
        <Fade
            in={true}
            timeout={duration ?? 1000}
            style={{ transitionDelay: `${delay ?? 0}ms` }}
        >
            <Button {...props} />
        </Fade>
    );
}
