import { Box, Grid, Typography } from "@mui/material";
import type { StudentEntryProps } from "../types/StudentEntryProps";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmIconButton from "@/app/components/ConfirmIconButton";

export function StudentEntry({
    name,
    uid,
    showDeleteButton,
    deleteFunction,
    deleteConfirmBoxContent,
    deleteRequireConfirm,
}: Readonly<StudentEntryProps>) {
    return (
        <Box className="flex flex-row w-full items-center rounded-2xl px-6 bg-[#f8fafc]">
            <Grid container spacing={0}>
                <Grid item xs={6} sm={4}>
                    <Typography color="info.main">{name}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Typography color="info.light">{uid}</Typography>
                </Grid>
            </Grid>
            {showDeleteButton && (
                <ConfirmIconButton
                    Icon={DeleteIcon}
                    color="error"
                    onClick={deleteFunction}
                    confirmBoxContent={deleteConfirmBoxContent}
                    requireConfirm={deleteRequireConfirm}
                />
            )}
        </Box>
    );
}
