import type SvgIcon from "@mui/material/SvgIcon";

export interface ConfirmIconButtonProps {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    requireConfirm?: boolean;
    confirmBoxContent?: string;
    onClick: React.ComponentProps<"button">["onClick"];
}
