import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import type { ConfirmIconButtonProps } from "../types/ConfirmIconButtonProps";
import React from "react";

export default function ConfirmIconButton({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    color,
    requireConfirm = true,
    confirmBoxContent,
    onClick,
}: Readonly<ConfirmIconButtonProps>) {
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
            <IconButton
                color={color}
                sx={{ m: 1 }}
                onClick={requireConfirm ? handleClickOpen : onClick}
            >
                <Icon />
            </IconButton>
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
