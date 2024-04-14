import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ComponentWrapper from "@/app/components/ComponentWrapper";

import CampaignIcon from "@mui/icons-material/Campaign";
import EditIcon from "@mui/icons-material/Edit";
import type { ReadOnlyAnnouncementProps } from "../types/ReadOnlyAnnouncementProps";

export default function ReadOnlyAnnouncement({
    title,
    content,
    createdBy,
    date,
    lastEdit,
    allowEdit,
    setIsEditing,
}: Readonly<ReadOnlyAnnouncementProps>) {
    return (
        <ComponentWrapper
            Icon={CampaignIcon}
            title={title}
            actionButton={
                allowEdit && (
                    <IconButton
                        type="button"
                        className="w-fit h-fit"
                        onClick={() => setIsEditing(true)}
                    >
                        <EditIcon />
                    </IconButton>
                )
            }
        >
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
                            color="primary.main"
                        >
                            Edited
                        </Typography>
                    </Tooltip>
                )}
            </Box>

            <Box className="mt-4 mb-7">
                <Typography
                    style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                    {content}
                </Typography>
            </Box>
        </ComponentWrapper>
    );
}
