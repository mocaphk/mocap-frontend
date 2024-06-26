"use client";

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import type { Theme, CSSObject, SxProps } from "@mui/material/styles";
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useRouter, usePathname } from "next/navigation";
interface MenuItem {
    text: string;
    icon: typeof SvgIcon;
    redirectPath?: string;
    highlightForPath?: string;
    onClick?: () => void;
}

const drawerWidth = 240;

const mainMenuItems: Array<MenuItem> = [
    {
        text: "Home",
        icon: HomeIcon,
        redirectPath: "/home",
        highlightForPath: "/home",
    },
    {
        text: "Workspace",
        icon: ComputerIcon,
        redirectPath: "/workspace",
        highlightForPath: "/workspace",
    },
    {
        text: "Courses",
        icon: MenuBookIcon,
        redirectPath: "/courses",
        highlightForPath: "/course",
    },
    {
        text: "Question Bank",
        icon: AccountBalanceIcon,
        redirectPath: "/questionBank",
        highlightForPath: "/questionBank",
    },
];

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
    // necessary for header to have the same height as the topbar
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

function MenuListItem({
    open,
    menuItem,
}: Readonly<{
    open: boolean;
    menuItem: MenuItem;
}>) {
    const { push } = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const highlight: boolean = menuItem.highlightForPath
        ? pathname.includes(menuItem.highlightForPath)
        : false;

    const handleClick = () => {
        if (menuItem.onClick) {
            menuItem.onClick();
        } else if (menuItem.redirectPath) {
            if (menuItem.redirectPath === "/workspace") {
                const latestAttemptedQuestion = localStorage.getItem(
                    "latestAttemptedQuestion"
                );
                if (latestAttemptedQuestion) {
                    push(`/workspace?questionId=${latestAttemptedQuestion}`);
                    return;
                }
            }
            push(menuItem.redirectPath);
        }
    };

    const defaultSx: SxProps<Theme> = {
        display: "block",
    };

    const activeMenuSx: SxProps<Theme> = {
        ...defaultSx,
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
    };

    return (
        <ListItem disablePadding sx={highlight ? activeMenuSx : defaultSx}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                }}
                onClick={handleClick}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                    }}
                >
                    <menuItem.icon color={highlight ? "primary" : "inherit"} />
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
    const [open, setOpen] = React.useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

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
                {open && (
                    <Typography
                        sx={{ ml: "14px", fontWeight: "bold" }}
                        color="primary"
                    >
                        MOCAPHK
                    </Typography>
                )}
            </DrawerHeader>
            <Divider />
            <Box
                className="overflow-y-auto overflow-x-hidden"
                sx={{ scrollbarWidth: "none" }}
            >
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
                    <MenuListItem
                        open={open}
                        menuItem={{
                            text: "Collapse",
                            icon: open ? ChevronLeftIcon : ChevronRightIcon,
                            onClick: toggleDrawer,
                        }}
                    />
                </List>
            </Box>
        </Drawer>
    );
}
