import {
    Box,
    Button,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import type { ChangeEventHandler } from "react";
import type { NewCourseProps } from "../types/NewCourseProps";

export default function NewCourseForm({
    form,
    handleChange,
}: Readonly<{
    form: NewCourseProps;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}>) {
    return (
        <>
            <DialogTitle color="info.main">New Course</DialogTitle>

            <Box
                id="new-course-form"
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
                            id="courseTitle"
                            name="courseTitle"
                            className="w-full"
                            label="Course Title"
                            color="secondary"
                            type="text"
                            autoComplete="off"
                            value={form.courseTitle}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="courseShortDescription"
                            name="courseShortDescription"
                            className="w-full"
                            label="Course Short Description"
                            color="secondary"
                            type="text"
                            autoComplete="off"
                            value={form.courseShortDescription}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="barColor"
                            name="barColor"
                            className="w-full"
                            label="Course Bar Color"
                            color="secondary"
                            type="color"
                            autoComplete="off"
                            value={form.barColor}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            id="new-course-button"
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
