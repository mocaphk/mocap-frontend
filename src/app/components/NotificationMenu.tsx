import { Box, Menu } from "@mui/material";
import LinkButton from "./LinkButton";
import type { NotificationProps } from "../types/NotificationProps";
import { NotificationTypes } from "@/enums/notificationTypes";

import SchoolIcon from "@mui/icons-material/School";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function NotificationMenu({
    anchorEl,
    open,
    notifications,
    handleMenuClose,
    handleAllMenuCLose,
}: Readonly<{
    anchorEl: null | HTMLElement;
    open: boolean;
    notifications: Array<NotificationProps>;
    handleMenuClose: React.ComponentProps<typeof Menu>["onClose"];
    handleAllMenuCLose: React.ComponentProps<typeof LinkButton>["onClick"];
}>) {
    const notificationTypeIconMap = {
        [NotificationTypes.Tutorial]: SchoolIcon,
        [NotificationTypes.Assignment]: DescriptionSharpIcon,
        [NotificationTypes.Announcement]: CampaignIcon,
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
            <Box className="flex flex-col py-1 gap-3 w-[530px]">
                {notifications.map((noti) => (
                    <LinkButton
                        key={noti.createdAt}
                        Icon={notificationTypeIconMap[noti.type]}
                        title={noti.title}
                        description=""
                        createdBy={`${noti.courseCode} ${noti.createdAt}`}
                        link={`${noti.link}?courseCode=${noti.courseCode}&year=${noti.year}&${noti.link}Id=${noti.itemId}`}
                        onClick={handleAllMenuCLose}
                    />
                ))}
            </Box>
        </Menu>
    );
}
