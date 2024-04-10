import React from "react";
import {
    Alert,
    Box,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import type { CreateExternalLinkInput } from "@schema";
import type { QueryResult } from "@apollo/client";
import type { GetCourseQuery } from "@/app/graphql/course/course.graphql";
import { useCreateExternalLinkMutation } from "@/app/graphql/course/externalLink.graphql";

export default function NewLinkForm({
    courseId,
    refetch,
    closeForm,
}: Readonly<{
    courseId: string;
    refetch: QueryResult<GetCourseQuery>["refetch"];
    closeForm: () => void;
}>) {
    const [createExternalLink, { error, loading }] =
        useCreateExternalLinkMutation();
    const [fetchError, setFetchError] = React.useState<boolean>(false);

    const onSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(
            formData.entries()
        ) as CreateExternalLinkInput;
        formValues.courseId = courseId;

        const result = await createExternalLink({
            variables: {
                externalLinkInput: formValues,
            },
        });

        const newLink = result?.data?.createExternalLink;

        const error =
            result?.errors !== undefined ||
            newLink === null ||
            newLink === undefined;

        setFetchError(error);
        if (error) {
            return;
        }

        // refetch links, close the form
        refetch();
        closeForm();
    };

    return (
        <>
            <DialogTitle color="info.main">New Link</DialogTitle>

            <Box
                id="new-link-form"
                component="form"
                onSubmit={onSubmit}
                className="w-full flex flex-col px-4 my-2"
            >
                <Grid container className="w-full my-2" spacing={2}>
                    {(error || fetchError) && (
                        <Grid item xs={12}>
                            <Alert className="w-full" severity="error">
                                Failed to create link. Please try again.
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
                            autoFocus={true}
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
                            label="Short Description"
                            type="text"
                            autoComplete="off"
                            inputProps={{ maxLength: 255 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="link"
                            name="link"
                            className="w-full"
                            label="URL"
                            type="url"
                            autoComplete="off"
                            inputProps={{ maxLength: 255 }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            id="new-link-button"
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
