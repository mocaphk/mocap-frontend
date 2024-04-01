import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import { Box, Typography, Link as MUILink, Tooltip } from "@mui/material";

import type { AnnouncementProps } from "../types/AnnouncementProps";

import CampaignIcon from "@mui/icons-material/Campaign";

export default function DetailedAnnouncementPage({
    courseCode,
    courseTitle,
    year,
    title,
    content,
    createdBy,
    date,
    lastEdit,
}: Readonly<AnnouncementProps>) {
    React.useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <CardWrapper>
            <Box className="flex flex-col mb-5">
                <Typography fontSize="1.3rem" fontWeight="medium">
                    {courseTitle}
                </Typography>
                <Typography color="secondary.main">{createdBy}</Typography>
            </Box>

            <ComponentWrapper Icon={CampaignIcon} title={title}>
                <Box className="flex flex-row gap-5 mt-[-7px]">
                    <Typography
                        fontSize="0.9rem"
                        fontWeight="medium"
                        color="info.light"
                    >
                        By {createdBy} · Created on {date}
                    </Typography>
                    {date !== lastEdit && (
                        <Tooltip
                            title={`Last edited on ${lastEdit}`}
                            placement="top"
                        >
                            <Typography
                                fontSize="0.9rem"
                                fontWeight="medium"
                                color="secondary.main"
                            >
                                Edited
                            </Typography>
                        </Tooltip>
                    )}
                </Box>

                <Box className="mt-4 mb-7">
                    <Typography>{content}</Typography>
                </Box>

                <Box className="mt-7">
                    <MUILink
                        href={`course?courseCode=${courseCode}&year=${year}`}
                        color="secondary"
                        underline="hover"
                    >
                        « Back to course page
                    </MUILink>
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
