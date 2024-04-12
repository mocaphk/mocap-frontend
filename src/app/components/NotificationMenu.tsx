import React from "react";
import { Box, Menu } from "@mui/material";
import LinkButton from "./LinkButton";
import type { NotificationProps } from "../types/NotificationProps";
import { NotificationTypes } from "@/enums/notificationTypes";

import SchoolIcon from "@mui/icons-material/School";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import CampaignIcon from "@mui/icons-material/Campaign";
import CustomSkeleton from "./CustomSkeleton";
import type { QueryResult } from "@apollo/client";
import NoResultAlert from "../errors/noResultAlert";
import type { GetAnnouncementsOfCurrentUserQuery } from "../graphql/course/announcement.graphql";
import { useMarkAnnouncementAsReadMutation } from "../graphql/course/announcement.graphql";

export default function NotificationMenu({
    loading,
    showErrorMessage,
    anchorEl,
    open,
    notifications,
    refetchNoti,
    handleMenuClose,
    handleAllMenuCLose,
}: Readonly<{
    loading: boolean;
    showErrorMessage: boolean;
    anchorEl: null | HTMLElement;
    open: boolean;
    notifications: Array<NotificationProps>;
    refetchNoti: QueryResult<GetAnnouncementsOfCurrentUserQuery>["refetch"];
    handleMenuClose: React.ComponentProps<typeof Menu>["onClose"];
    handleAllMenuCLose: () => void;
}>) {
    const [markAnnouncementAsRead, { error, loading: loadingMarkAsRead }] =
        useMarkAnnouncementAsReadMutation();

    const notificationTypeIconMap = {
        [NotificationTypes.Tutorial]: SchoolIcon,
        [NotificationTypes.Assignment]: DescriptionSharpIcon,
        [NotificationTypes.Announcement]: CampaignIcon,
    };

    const onNotiClick = (notiId: string, isNotiRead: boolean) => {
        if (!isNotiRead) {
            onMarkNotiAsRead(notiId);
        }

        handleAllMenuCLose();
    };

    const onMarkNotiAsRead = async (notiId: string) => {
        const result = await markAnnouncementAsRead({
            variables: {
                id: notiId,
            },
        });

        const markAsReadResult = result?.data?.markAnnouncementAsRead;

        const error =
            result?.errors !== undefined ||
            markAsReadResult === null ||
            markAsReadResult === undefined;

        refetchNoti();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            id="noti-menu"
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={open}
            onClose={handleMenuClose}
            slotProps={{
                paper: {
                    sx: {
                        px: "1rem",
                        maxHeight: "20rem",
                        scrollbarWidth: "thin",
                    },
                },
            }}
        >
            {loading ? (
                <Box className="my-2">
                    <CustomSkeleton
                        width={530}
                        height={80}
                        amount={3}
                        sx={{ my: -2 }}
                    />
                </Box>
            ) : showErrorMessage || notifications.length === 0 ? (
                <NoResultAlert />
            ) : (
                <Box className="flex flex-col py-1 gap-3 w-[530px]">
                    {notifications.map((noti) => (
                        <Box
                            key={noti.date}
                            className={
                                noti.isRead
                                    ? "border-[transparent] border-2 rounded-2xl"
                                    : "border-[#d32f2f] border-2 rounded-2xl"
                            }
                        >
                            <LinkButton
                                Icon={notificationTypeIconMap[noti.type]}
                                title={noti.title}
                                description=""
                                createdBy={`${noti.courseCode} ${noti.date}`}
                                link={noti.link}
                                onClick={() =>
                                    onNotiClick(noti.id, noti.isRead)
                                }
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Menu>
    );
}
