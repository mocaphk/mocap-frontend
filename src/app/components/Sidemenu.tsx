"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import type { Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ComputerIcon from "@mui/icons-material/Computer";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import type SvgIcon from "@mui/material/SvgIcon";
import { Typography } from "@mui/material";

import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing(0, 1.5),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

// eslint-disable-next-line @typescript-eslint/naming-convention
const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

interface MenuItem {
    text: string;
    icon: typeof SvgIcon;
    onClick: () => void;
}

function MenuListItem({
    open,
    menuItem,
}: {
    open: boolean;
    menuItem: MenuItem;
}) {
    return (
        <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                }}
                onClick={menuItem.onClick}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                    }}
                >
                    <menuItem.icon />
                </ListItemIcon>
                <ListItemText
                    primary={menuItem.text}
                    sx={{ opacity: open ? 1 : 0 }}
                />
            </ListItemButton>
        </ListItem>
    );
}

export default function SideMenu() {
    const [open, setOpen] = React.useState(false);
    const { replace } = useRouter();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    // client side redirects require a useRouter hook, the const menu item thus placed in the function
    const mainMenuItems: Array<MenuItem> = [
        {
            text: "Home",
            icon: HomeIcon,
            onClick: () => {
                console.log("home btn clicked");
                replace("/home");
            },
        },
        {
            text: "Workspace",
            icon: ComputerIcon,
            onClick: () => {},
        },
        {
            text: "Courses",
            icon: MenuBookIcon,
            onClick: () => {},
        },
        {
            text: "Calendar",
            icon: CalendarMonthIcon,
            onClick: () => {},
        },
        {
            text: "Question Bank",
            icon: AccountBalanceIcon,
            onClick: () => {},
        },
    ];
    
    const otherMenuItems: Array<MenuItem> = [
        {
            text: "Dashboard",
            icon: DashboardIcon,
            onClick: () => {},
        },
    ];

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <Image
                    src="/logo.svg"
                    alt="MOCAP Logo"
                    width={40}
                    height={40}
                    priority
                />
                {open && <Typography sx={{ ml: "0.5rem", fontWeight: 'bold' }} color="secondary">MOCAPHK</Typography>}
            </DrawerHeader>
            <Divider />
            <List>
                {mainMenuItems.map((menuItem) => (
                    <MenuListItem
                        key={menuItem.text}
                        open={open}
                        menuItem={menuItem}
                    />
                ))}
            </List>
            <Divider />
            <List>
                {otherMenuItems.map((menuItem) => (
                    <MenuListItem
                        key={menuItem.text}
                        open={open}
                        menuItem={menuItem}
                    />
                ))}
            </List>
            <Divider />
            <List>
                <MenuListItem
                    open={open}
                    menuItem={{
                        text: "Collapse",
                        icon: open ? ChevronLeftIcon : ChevronRightIcon,
                        onClick: toggleDrawer,
                    }}
                />
            </List>
        </Drawer>
    );
}
