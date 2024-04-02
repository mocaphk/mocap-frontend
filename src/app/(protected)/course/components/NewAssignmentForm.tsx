import { useCreateAssignmentMutation } from "@/app/graphql/course/assignment.graphql";
import { LoadingButton } from "@mui/lab";
import {
    Alert,
    Autocomplete,
    Box,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { AssignmentType } from "@schema";
import type { CreateAssignmentInput } from "@schema";
import { useRouter } from "next/navigation";
import React from "react";
import DateTimeCalender from "@/app/components/DateTimeCalender";
import { capitalizeFirstLetter } from "@/app/utils/string";

export default function NewAssignmentForm({ courseId }: { courseId: string }) {
    const [createAssignment, { error, loading }] =
        useCreateAssignmentMutation();
    const [fetchError, setFetchError] = React.useState<boolean>(false);
    const { push } = useRouter();

    const onSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(
            formData.entries()
        ) as CreateAssignmentInput;
        formValues.courseId = courseId;
        formValues.type = formValues.type.toUpperCase() as AssignmentType;
        const result = await createAssignment({
            variables: {
                assignmentInput: formValues,
            },
        });
        const newAssignment = result?.data?.createAssignment;
        const error =
            result?.errors !== undefined ||
            newAssignment === null ||
            newAssignment === undefined;
        setFetchError(error);
        if (error) {
            return;
        }
        push(`/assignment?id=${newAssignment.id}`);
    };

    return (
        <>
            <DialogTitle color="info.main">New Assignment</DialogTitle>

            <Box
                id="new-assignment-form"
                component="form"
                onSubmit={onSubmit}
                className="w-full flex flex-col px-4 my-2"
            >
                <Grid container className="w-full my-2" spacing={2}>
                    {(error || fetchError) && (
                        <Grid item xs={12}>
                            <Alert className="w-full" severity="error">
                                Failed to create assignment. Please try again.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            id="title"
                            name="title"
                            className="w-full"
                            label="Title"
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
                            label="Description"
                            type="text"
                            autoComplete="off"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            id="type"
                            className="w-full"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="type"
                                    name="type"
                                    label="Type"
                                    required
                                />
                            )}
                            options={Object.values(AssignmentType)}
                            getOptionLabel={(option) =>
                                capitalizeFirstLetter(option.toLowerCase())
                            }
                            autoHighlight
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {" "}
                        <DateTimeCalender
                            name="dateOpen"
                            label="Open Date"
                            className="w-full"
                            disablePast
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DateTimeCalender
                            name="dateDue"
                            label="Due Date"
                            className="w-full"
                            disablePast
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DateTimeCalender
                            name="dateClose"
                            label="Close Date"
                            className="w-full"
                            disablePast
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            id="new-assignment-button"
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
