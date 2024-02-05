import { Typography, Box } from "@mui/material";
import type { LinkButtonProps } from "../types/LinkButtonProps";
import { Status, Type } from "../types/AssignmentCardProps";

import DoneIcon from "@mui/icons-material/Done";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SchoolIcon from "@mui/icons-material/School";

export default function LinkButton({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    description,
    createdBy,
    assignmentType,
    status,
}: Readonly<LinkButtonProps>) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const ButtonIcon = () => {
        if (Icon) {
            return (
                <Icon sx={{ height: "1.2rem", width: "1.2rem" }} color="info" />
            );
        }

        if (assignmentType) {
            return assignmentTypeMap[assignmentType];
        }

        return <></>;
    };

    const assignmentTypeMap = {
        [Type.Assignment]: (
            <DescriptionSharpIcon
                sx={{ height: "1.2rem", width: "1.2rem" }}
                color="info"
            />
        ),
        [Type.Tutorial]: (
            <SchoolIcon
                sx={{ height: "1.2rem", width: "1.2rem" }}
                color="info"
            />
        ),
    };

    const statusIconMap = {
        [Status.Completed]: (
            <DoneIcon
                sx={{ height: "1.2rem", width: "1.2rem", color: "lime" }}
            />
        ),
        [Status.Ongoing]: (
            <TripOriginIcon
                sx={{ height: "1.2rem", width: "1.2rem", color: "#ffcc00" }}
            />
        ),
        [Status.Overdue]: (
            <CloseIcon
                sx={{ height: "1.2rem", width: "1.2rem", color: "red" }}
            />
        ),
    };
    return (
        <button className="flex flex-row w-full items-center justify-between rounded-2xl px-6 py-3 bg-[#f8fafc] hover:bg-[#f1f5f9] active:bg-[#e2e8f0] focus:outline-none focus:ring">
            <Box className="flex flex-row items-center">
                <ButtonIcon />

                <Typography
                    marginLeft={1}
                    fontSize="1rem"
                    fontWeight="medium"
                    color="info.main"
                >
                    {title}
                </Typography>

                <Typography
                    marginLeft={1}
                    fontSize="1rem"
                    fontWeight="medium"
                    color="info.light"
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
                    >
                        {createdBy}
                    </Typography>
                )}
                {status && statusIconMap[status]}
            </Box>
        </button>
    );
}
