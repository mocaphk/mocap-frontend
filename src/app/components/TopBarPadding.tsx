"use client";

import { styled } from "@mui/material/styles";

// eslint-disable-next-line @typescript-eslint/naming-convention
const TopBarPadding = styled("div")(({ theme }) => ({
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default TopBarPadding;