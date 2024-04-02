import {
    Alert,
    Box,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useCreateCourseMutation } from "@/app/graphql/course/course.graphql";
import { LoadingButton } from "@mui/lab";
import React from "react";
import { useRouter } from "next/navigation";
import type { CreateCourseInput } from "@schema";

export default function NewCourseForm() {
    const [createCourse, { error, loading }] = useCreateCourseMutation();
    const [fetchError, setFetchError] = React.useState<boolean>(false);
    const { push } = useRouter();

    const onSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(
            formData.entries()
        ) as CreateCourseInput;

        const result = await createCourse({
            variables: {
                courseInput: formValues,
            },
        });

        const newCourse = result?.data?.createCourse;

        const error =
            result?.errors !== undefined ||
            newCourse === null ||
            newCourse === undefined;

        setFetchError(error);
        if (error) {
            return;
        }

        push(`/course?id=${newCourse.id}`);
    };

    return (
        <>
            <DialogTitle color="info.main">New Course</DialogTitle>

            <Box
                id="new-course-form"
                component="form"
                onSubmit={onSubmit}
                className="w-full flex flex-col px-4 my-2"
            >
                <Grid container className="w-full my-2" spacing={2}>
                    {(error || fetchError) && (
                        <Grid item xs={12}>
                            <Alert className="w-full" severity="error">
                                Failed to create course. Please try again.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            id="code"
                            name="code"
                            className="w-full"
                            label="Course Code"
                            type="text"
                            autoFocus={true}
                            autoComplete="off"
                            inputProps={{ maxLength: 255 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            name="name"
                            className="w-full"
                            label="Course Title"
                            type="text"
                            autoComplete="off"
                            inputProps={{ maxLength: 255 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="description"
                            name="description"
                            className="w-full"
                            label="Course Short Description"
                            type="text"
                            autoComplete="off"
                            inputProps={{ maxLength: 255 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="barColor"
                            name="barColor"
                            className="w-full"
                            label="Course Bar Color"
                            type="color"
                            autoComplete="off"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            id="new-course-button"
                            name="submit"
                            className="w-full"
                            type="submit"
                            variant="contained"
                            loading={loading}
                        >
                            <Typography className="p-2">Add</Typography>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
