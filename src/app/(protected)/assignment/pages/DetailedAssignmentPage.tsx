import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import { Box, Typography, Link as MUILink } from "@mui/material";
import type { SvgIconTypeMap } from "@mui/material";
import { AssignmentStatus } from "@/enums/assignmentStatus";
import type { AssignmentProps } from "../types/AssignmentProps";

import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SchoolIcon from "@mui/icons-material/School";
import QuestionList from "../components/QuestionList";
import { AssignmentType } from "@schema";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export default function DetailedAssignmentPage({
    title,
    description,
    dueDate,
    courseCode,
    year,
    status,
    type,
    questions,
}: Readonly<AssignmentProps>) {
    const assignmentTypeIconMap: Record<
        AssignmentType,
        OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string }
    > = {
        [AssignmentType.Assignment]: DescriptionSharpIcon,
        [AssignmentType.Tutorial]: SchoolIcon,
    };

    const statusDisplayMap = {
        [AssignmentStatus.Completed]: {
            display: "Completed",
            color: "lime",
        },
        [AssignmentStatus.Ongoing]: {
            display: "Ongoing",
            color: "#ffcc00",
        },
        [AssignmentStatus.Overdue]: {
            display: "Overdue",
            color: "red",
        },
    };

    return (
        <CardWrapper>
            <ComponentWrapper Icon={assignmentTypeIconMap[type]} title={title}>
                <Box className="flex flex-row gap-5 mt-[-7px]">
                    <Typography
                        fontSize="0.9rem"
                        fontWeight="medium"
                        color="info.light"
                    >
                        From {courseCode} · Due on {dueDate}
                    </Typography>
                    <Typography
                        fontSize="0.9rem"
                        fontWeight="medium"
                        color={statusDisplayMap[status].color}
                    >
                        {statusDisplayMap[status].display}
                    </Typography>
                </Box>

                <Box className="mt-4 mb-7">
                    <Typography>{description}</Typography>
                </Box>

                <QuestionList questions={questions} />

                <Box className="mt-7">
                    <MUILink
                        href={`course?courseCode=${courseCode}&year=${year}`}
                        color="secondary"
                        underline="hover"
                    >
                        « Back to course page
                    </MUILink>
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
