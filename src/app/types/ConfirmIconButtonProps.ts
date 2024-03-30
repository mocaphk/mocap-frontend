import type { IconButton } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";

export interface ConfirmIconButtonProps {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    color: React.ComponentProps<typeof IconButton>["color"];
    requireConfirm?: boolean;
    confirmBoxContent?: string;
    onClick: React.ComponentProps<"button">["onClick"];
}
