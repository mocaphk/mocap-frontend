import type SvgIcon from "@mui/material/SvgIcon";
import type { Status, Type } from "./AssignmentCardProps";

export interface LinkButtonProps {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon?: typeof SvgIcon;
    title: string;
    description: string;
    createdBy?: string;
    assignmentType?: Type;
    status?: Status;
    link?: string;
    path?: string;
}
