"use client";

import { Fade, Typography } from "@mui/material";

export default function FadedInTypography(
    props: React.ComponentProps<typeof Typography> & {
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
            <Typography {...props} />
        </Fade>
    );
}
