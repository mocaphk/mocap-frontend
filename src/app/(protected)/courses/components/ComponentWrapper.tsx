import Link from "next/link";
import { Typography, Box } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";
import type { LinkButtonProps } from "../types/LinkButtonProps";
import LinkButton from "./LinkButton";

export default function ComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    linkButtonsProps,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    linkButtonsProps: Array<LinkButtonProps>;
}>) {
    return (
        <Box className="flex flex-col w-full gap-5">
            <Box className="flex flex-row h-full items-center">
                <Icon sx={{ height: "1.5rem", width: "1.5rem" }} color="info" />
                <Typography
                    marginLeft={1}
                    fontSize="1.3rem"
                    fontWeight="medium"
                    color="info.main"
                >
                    {title}
                </Typography>
            </Box>
            <Box className="flex flex-col gap-3">
                {linkButtonsProps.map((val) => (
                    <Link
                        key={val.title}
                        href={val.link || val.path || "/home"}
                        className="w-full rounded-2xl"
                    >
                        <LinkButton {...val} />
                    </Link>
                ))}
            </Box>
        </Box>
    );
}
