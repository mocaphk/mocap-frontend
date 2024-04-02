import React from "react";
import Skeleton from "@mui/material/Skeleton";

export default function CustomSkeleton(
    props: React.ComponentProps<typeof Skeleton> & { amount?: number }
) {
    const { amount = 1, ...skeletonProps } = props;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const skeletons = Array.from({ length: amount }, (_, index) => (
        <Skeleton
            key={index}
            animation="wave"
            {...skeletonProps}
            sx={{ bgcolor: "background.default", ...skeletonProps.sx }}
        />
    ));

    return <>{skeletons}</>;
}
