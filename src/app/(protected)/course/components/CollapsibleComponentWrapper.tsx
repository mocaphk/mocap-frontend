"use client";

import React from "react";
import { TransitionGroup } from "react-transition-group";
import { Button, Collapse } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";
import type { LinkButtonProps } from "@/app/types/LinkButtonProps";
import LinkButton from "@/app/components/LinkButton";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import NoResultAlert from "@/app/errors/noResultAlert";

// ref to mui transitions: https://mui.com/material-ui/transitions/

export default function CollapsibleComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    actionButton,
    linkButtonsProps = [],
    displayAmount,
    loading = false,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    actionButton?: React.ReactNode;
    linkButtonsProps?: Array<LinkButtonProps>;
    displayAmount: number;
    loading?: boolean;
}>) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const collapseButton = (val: LinkButtonProps) => (
        <Collapse key={val.title}>
            <LinkButton {...val} />
        </Collapse>
    );

    return (
        <ComponentWrapper Icon={Icon} title={title} actionButton={actionButton}>
            {loading ? (
                <CustomSkeleton
                    amount={displayAmount}
                    sx={{
                        minHeight: 85,
                        borderRadius: 5,
                    }}
                />
            ) : linkButtonsProps.length === 0 ? (
                <NoResultAlert />
            ) : (
                <>
                    <TransitionGroup className="flex flex-col gap-3 mb-3">
                        {isExpanded
                            ? linkButtonsProps.map((val) => collapseButton(val))
                            : linkButtonsProps
                                  .slice(
                                      0,
                                      Math.min(
                                          displayAmount,
                                          linkButtonsProps.length
                                      )
                                  )
                                  .map((val) => collapseButton(val))}
                    </TransitionGroup>
                    {linkButtonsProps.length > displayAmount && (
                        <Button onClick={toggleExpanded} variant="outlined">
                            {isExpanded ? "Less..." : "More..."}
                        </Button>
                    )}
                </>
            )}
        </ComponentWrapper>
    );
}
