"use client";

import React from "react";
import Link from "next/link";
import { TransitionGroup } from "react-transition-group";
import { Typography, Button, Box, Collapse } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";
import type { LinkButtonProps } from "../types/LinkButtonProps";
import LinkButton from "./LinkButton";

// ref to mui transitions: https://mui.com/material-ui/transitions/

export default function ComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    linkButtonsProps,
    displayAmount,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    linkButtonsProps: Array<LinkButtonProps>;
    displayAmount: number;
}>) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const collapseButton = (val: LinkButtonProps) => (
        <Collapse key={val.title}>
            <Link
                href={val.link ?? val.path ?? "/home"}
                className="w-full rounded-2xl"
            >
                <LinkButton {...val} />
            </Link>
        </Collapse>
    );

    return (
        <Box className="flex flex-col w-full">
            <Box className="flex flex-row h-full items-center mb-5">
                <Icon sx={{ height: "1.5rem", width: "1.5rem" }} color="info" />
                <Typography
                    marginLeft={1}
                    fontSize="1.3rem"
                    fontWeight="medium"
                    color="info.main"
                >
                    {title}
                </Typography>
            </Box>
            <TransitionGroup className="flex flex-col gap-3 mb-3">
                {isExpanded
                    ? linkButtonsProps.map((val) => collapseButton(val))
                    : linkButtonsProps
                          .slice(
                              0,
                              Math.min(displayAmount, linkButtonsProps.length)
                          )
                          .map((val) => collapseButton(val))}
            </TransitionGroup>
            {linkButtonsProps.length > displayAmount && (
                <Button
                    onClick={toggleExpanded}
                    color="secondary"
                    variant="outlined"
                >
                    {isExpanded ? "Less..." : "More..."}
                </Button>
            )}
        </Box>
    );
}
