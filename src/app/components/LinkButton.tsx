import Link from "next/link";
import { Typography, Box } from "@mui/material";
import type { LinkButtonProps } from "../types/LinkButtonProps";

export default function LinkButton({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    description,
    createdBy,
    statusIcon,
    link,
    onClick,
}: Readonly<LinkButtonProps>) {
    return (
        <Link href={link ?? "/home"} className="w-full rounded-2xl">
            <button
                className="flex flex-row w-full items-center justify-between rounded-2xl px-6 py-3 bg-[#f8fafc] hover:bg-[#f1f5f9] active:bg-[#e2e8f0] focus:outline-none focus:ring"
                onClick={onClick}
            >
                <Box className="flex flex-row items-center w-11/12">
                    <Icon
                        sx={{ height: "1.2rem", width: "1.2rem" }}
                        color="info"
                    />

                    <Typography
                        marginLeft={1}
                        fontSize="1rem"
                        fontWeight="medium"
                        color="info.main"
                        whiteSpace="nowrap"
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            wordBreak: "break-all",
                        }}
                        marginLeft={1}
                        fontSize="1rem"
                        fontWeight="medium"
                        color="info.light"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {description}
                    </Typography>
                </Box>
                <Box className="flex flex-row items-center">
                    {createdBy && (
                        <Typography
                            marginLeft={1}
                            fontSize="1rem"
                            fontWeight="medium"
                            color="info.light"
                            whiteSpace="nowrap"
                        >
                            {createdBy}
                        </Typography>
                    )}
                    {statusIcon && (
                        <statusIcon.icon
                            sx={{
                                height: "1.2rem",
                                width: "1.2rem",
                                color: statusIcon.color,
                            }}
                        />
                    )}
                </Box>
            </button>
        </Link>
    );
}
