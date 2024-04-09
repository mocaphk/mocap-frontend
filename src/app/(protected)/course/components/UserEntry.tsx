import { Box, Grid, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmIconButton from "@/app/components/ConfirmIconButton";
import type { UserEntryProps } from "../types/UserEntryProps";
import { capitalizeFirstLetter } from "@/app/utils/string";

export function UserEntry({
    name,
    roles,
    showDeleteButton,
    deleteFunction,
    deleteConfirmBoxContent,
    deleteRequireConfirm,
}: Readonly<UserEntryProps>) {
    return (
        <Box className="flex flex-row w-full items-center rounded-2xl px-6 bg-[#f8fafc]">
            <Grid container spacing={0} alignItems="center">
                <Grid item xs={6} sm={4}>
                    <Typography color="info.main">{name}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Typography color="info.light">
                        {roles
                            .map((role) =>
                                capitalizeFirstLetter(role.toLowerCase())
                            )
                            .join(", ")}
                    </Typography>
                </Grid>
            </Grid>
            {showDeleteButton ? (
                <ConfirmIconButton
                    Icon={DeleteIcon}
                    color="error"
                    onClick={deleteFunction}
                    confirmBoxContent={deleteConfirmBoxContent}
                    requireConfirm={deleteRequireConfirm}
                />
            ) : (
                <Box className="w-14 h-14"></Box>
            )}
        </Box>
    );
}
