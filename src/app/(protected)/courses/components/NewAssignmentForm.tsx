import {
    Box,
    Button,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import type { ChangeEventHandler } from "react";
import type { NewAssignmentProps } from "../types/NewAssignmentProps";

export default function NewAssignmentForm({
    form,
    handleChange,
}: Readonly<{
    form: NewAssignmentProps;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}>) {
    return (
        <>
            <DialogTitle color="info.main">New Assignment</DialogTitle>

            <Box
                id="new-assignment-form"
                component="form"
                action="ToBeChanged"
                method="post"
                className="w-full flex flex-col px-4 my-2"
            >
                <Grid container className="w-full my-2" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="courseCode"
                            name="courseCode"
                            className="w-full"
                            label="Course Code"
                            color="secondary"
                            type="text"
                            autoFocus={true}
                            autoComplete="off"
                            value={form.courseCode}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="assignmentTitle"
                            name="assignmentTitle"
                            className="w-full"
                            label="Assignment Title"
                            color="secondary"
                            type="text"
                            autoComplete="off"
                            value={form.assignmentTitle}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="assignmentShortDescription"
                            name="assignmentShortDescription"
                            className="w-full"
                            label="Assignment Short Description"
                            color="secondary"
                            type="text"
                            autoComplete="off"
                            value={form.assignmentShortDescription}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="openDate"
                            name="openDate"
                            className="w-full"
                            label="Open Date"
                            color="secondary"
                            type="date"
                            autoComplete="off"
                            value={form.openDate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="dueDate"
                            name="dueDate"
                            className="w-full"
                            label="Due Date"
                            color="secondary"
                            type="date"
                            autoComplete="off"
                            value={form.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="closeDate"
                            name="closeDate"
                            className="w-full"
                            label="Close Date"
                            color="secondary"
                            type="date"
                            autoComplete="off"
                            value={form.closeDate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            id="new-assignment-button"
                            name="submit"
                            className="w-full"
                            type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            <Typography className="p-2">Add</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
