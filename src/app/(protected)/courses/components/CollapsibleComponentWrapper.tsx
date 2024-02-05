"use client";

import React from "react";
import Link from "next/link";
import { TransitionGroup } from "react-transition-group";
import { Button, Collapse } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";
import type { LinkButtonProps } from "../types/LinkButtonProps";
import LinkButton from "./LinkButton";
import ComponentWrapper from "@/app/components/ComponentWrapper";

// ref to mui transitions: https://mui.com/material-ui/transitions/

export default function CollapsibleComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    actionButton,
    linkButtonsProps,
    displayAmount,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    actionButton?: React.ReactNode;
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
        <ComponentWrapper Icon={Icon} title={title} actionButton={actionButton}>
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
        </ComponentWrapper>
    );
}
