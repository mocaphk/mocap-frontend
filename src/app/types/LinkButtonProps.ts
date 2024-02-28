import type SvgIcon from "@mui/material/SvgIcon";

export interface LinkButtonProps {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    description: string;
    createdBy?: string;
    statusIcon?: {
        icon: typeof SvgIcon;
        color: string;
    };
    link?: string;
}
