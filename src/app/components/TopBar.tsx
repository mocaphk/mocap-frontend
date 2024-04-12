"use client";

import { useSession } from "next-auth/react";

import * as React from "react";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import NotificationMenu from "./NotificationMenu";
import useDebouncedResize from "../utils/resizeHandler";
import type { NotificationProps } from "../types/NotificationProps";
import { NotificationTypes } from "@/enums/notificationTypes";
import { useGetAnnouncementsOfCurrentUserQuery } from "../graphql/course/announcement.graphql";

function TopBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                elevation={0}
                color="secondary"
                className="border-solid border-b"
            >
                <Toolbar>
                    <TopBarAuthHandler />
                </Toolbar>
            </AppBar>
        </Box>
    );
}

function TopBarAuthHandler() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <Box className="flex-grow" />
                <AuthedTopBar username={session?.user?.name} />
            </>
        );
    }

    return (
        <>
            <Box className="flex flex-grow flex-row items-center gap-2 select-none">
                <Image
                    draggable={false}
                    src="/logo.svg"
                    alt="MOCAP Logo"
                    width={52}
                    height={52}
                    priority
                />
                <Typography variant="h6" color="primary">
                    MOCAPHK
                </Typography>
            </Box>
            <Button
                href="/login"
                variant="outlined"
                startIcon={<AccountCircle />}
            >
                Sign in
            </Button>
        </>
    );
}

function AuthedTopBar({
    username,
}: Readonly<{ username: string | null | undefined }>) {
    const { push } = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const [isProfileMenuOpen, setIsProfileMenuOpen] =
        React.useState<boolean>(false);
    const [isNotiMenuOpen, setIsNotiMenuOpen] = React.useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        React.useState<boolean>(false);

    const handleNotiMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setIsNotiMenuOpen(true);
    };

    const handleNotiMenuClose = () => {
        setAnchorEl(null);
        setIsNotiMenuOpen(false);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setIsProfileMenuOpen(true);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
        setIsProfileMenuOpen(false);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
        setIsMobileMenuOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
        setIsMobileMenuOpen(false);
    };

    const handleAllMenuClose = () => {
        // remove anchor
        setAnchorEl(null);

        // turn off popup menu
        setIsProfileMenuOpen(false);
        setIsNotiMenuOpen(false);

        // off mobile popup menu
        handleMobileMenuClose();
    };

    // fetch noti
    const {
        loading,
        error,
        data: announcementData,
        refetch: refetchNoti,
    } = useGetAnnouncementsOfCurrentUserQuery();

    const announcement = announcementData?.announcementsOfCurrentUser;

    const showErrorMessage =
        !loading &&
        (announcementData === undefined ||
            error ||
            announcement === undefined ||
            announcement === null);

    const notiData: Array<NotificationProps> = (announcement ?? []).map(
        (ann) => {
            return {
                type: NotificationTypes.Announcement,
                id: ann.id,
                title: ann.title,
                date: ann.updatedAt,
                courseCode: ann.course?.code ?? "",
                link: `announcement?id=${ann.id}`,
                isRead: ann.isReadByCurrentUser ?? false,
            };
        }
    );

    // close all menu if window resized
    useDebouncedResize(handleAllMenuClose, 200);

    const numOfNotifications = notiData.filter((noti) => !noti.isRead).length;

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isProfileMenuOpen}
            onClose={handleProfileMenuClose}
        >
            <MenuItem disabled divider>
                {username ?? "ERROR!"}
            </MenuItem>
            <MenuItem onClick={handleAllMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleAllMenuClose}>My account</MenuItem>
            <MenuItem
                onClick={() => {
                    handleAllMenuClose();
                    push("/logout");
                }}
            >
                Sign out
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="help" color="inherit">
                    <HelpIcon />
                </IconButton>
                <p>Help</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="settings" color="inherit">
                    <SettingsIcon />
                </IconButton>
                <p>Settings</p>
            </MenuItem>
            <MenuItem onClick={handleNotiMenuOpen}>
                <IconButton
                    size="large"
                    aria-label={`show ${numOfNotifications} new notifications`}
                    color="inherit"
                >
                    <Badge badgeContent={numOfNotifications} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Account</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton size="large" aria-label="help" color="inherit">
                    <HelpIcon />
                </IconButton>
                <IconButton size="large" aria-label="settings" color="inherit">
                    <SettingsIcon />
                </IconButton>
                <IconButton
                    size="large"
                    aria-label={`show ${numOfNotifications} new notifications`}
                    onClick={handleNotiMenuOpen}
                    color="inherit"
                >
                    <Badge badgeContent={numOfNotifications} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                >
                    <MoreIcon />
                </IconButton>
            </Box>
            {renderMobileMenu}
            {renderMenu}
            <NotificationMenu
                loading={loading}
                showErrorMessage={!!showErrorMessage}
                anchorEl={anchorEl}
                open={isNotiMenuOpen}
                notifications={notiData}
                refetchNoti={refetchNoti}
                handleMenuClose={handleNotiMenuClose}
                handleAllMenuCLose={handleAllMenuClose}
            />
        </>
    );
}

export default TopBar;
