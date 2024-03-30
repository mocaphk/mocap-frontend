import type { ConfirmIconButtonProps } from "../types/ConfirmIconButtonProps";
import ConfirmIconButton from "./ConfirmIconButton";

import DeleteIcon from "@mui/icons-material/Delete";

export default function ConfirmDeleteButton({
    requireConfirm = true,
    confirmBoxContent,
    onClick,
}: Readonly<
    Pick<
        ConfirmIconButtonProps,
        Exclude<keyof ConfirmIconButtonProps, "Icon" | "color">
    >
>) {
    return (
        <ConfirmIconButton
            Icon={DeleteIcon}
            color="error"
            requireConfirm={requireConfirm}
            confirmBoxContent={confirmBoxContent}
            onClick={onClick}
        />
    );
}
