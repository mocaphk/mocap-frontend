import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import type { ConfirmIconButtonProps } from "../types/ConfirmIconButtonProps";
import React from "react";
import LoadingIconButton from "./LoadingIconButton";

export default function ConfirmIconButton(
    props: React.ComponentProps<typeof LoadingIconButton> &
        ConfirmIconButtonProps
) {
    const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Icon,
        requireConfirm = true,
        confirmBoxContent,
        onClick,
        ...otherProps
    } = props;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(event);
        }
        handleClose();
    };

    return (
        <>
            <LoadingIconButton
                type="button"
                className="w-fit h-fit"
                onClick={requireConfirm ? handleClickOpen : onClick}
                {...otherProps}
            >
                <Icon />
            </LoadingIconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmBoxContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm} autoFocus>
                        Yes
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
