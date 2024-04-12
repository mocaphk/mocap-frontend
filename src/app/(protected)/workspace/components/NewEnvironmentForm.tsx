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
import type { CreateCodingEnvironmentInput } from "@schema";
import type { QueryResult } from "@apollo/client";
import {
    useBuildCodingEnvironmentMutation,
    useCreateCodingEnvironmentMutation,
} from "@/app/graphql/workspace/codingEnvironment.graphql";
import type { GetCodingEnvironmentByAssignmentIdQuery } from "@/app/graphql/workspace/codingEnvironment.graphql";
import { readFileContent } from "@/app/utils/file";

export default function NewEnvironmentForm({
    courseId,
    refetch,
    closeForm,
}: Readonly<{
    courseId: string;
    refetch: QueryResult<GetCodingEnvironmentByAssignmentIdQuery>["refetch"];
    closeForm: () => void;
}>) {
    const [
        createCodingEnvironment,
        { error: createError, loading: createLoading },
    ] = useCreateCodingEnvironmentMutation();
    const [
        buildCodingEnvironment,
        { error: buildError, loading: buildLoading },
    ] = useBuildCodingEnvironmentMutation();

    const [createFetchError, setCreateFetchError] =
        React.useState<boolean>(false);
    const [buildFetchError, setBuildFetchError] =
        React.useState<boolean>(false);

    const onSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(formData.entries());
        const createCodingEnvironmentInput: CreateCodingEnvironmentInput = {
            name: formValues.name as string,
            description: formValues.description as string,
            courseId: courseId,
            dockerfile:
                ((await readFileContent(
                    formValues.dockerfile as File
                )) as string) ?? "",
        };

        // create env
        const createResult = await createCodingEnvironment({
            variables: {
                codingEnvironmentInput: createCodingEnvironmentInput,
            },
        });

        const newEnv = createResult?.data?.createCodingEnvironment;

        const createErrorTemp =
            createResult?.errors !== undefined ||
            newEnv === null ||
            newEnv === undefined;

        setCreateFetchError(createErrorTemp);
        if (createErrorTemp) {
            return;
        }

        // build env
        const buildResult = await buildCodingEnvironment({
            variables: {
                id: newEnv?.id ?? "",
            },
        });

        const builtEnv = buildResult?.data?.buildCodingEnvironment;

        const buildErrorTemp =
            buildResult?.errors !== undefined ||
            builtEnv === null ||
            builtEnv === undefined;

        setBuildFetchError(buildErrorTemp);
        if (buildErrorTemp) {
            return;
        }

        // refetch coding env, close the form
        refetch();
        closeForm();
    };

    return (
        <>
            <DialogTitle color="info.main">New Coding Environment</DialogTitle>

            <Box
                id="new-environment-form"
                component="form"
                onSubmit={onSubmit}
                className="w-full flex flex-col px-4 my-2"
            >
                <Grid container className="w-full my-2" spacing={2}>
                    {(createError || createFetchError) && (
                        <Grid item xs={12}>
                            <Alert className="w-full" severity="error">
                                Failed to create environment. Please try again.
                            </Alert>
                        </Grid>
                    )}
                    {(buildError || buildFetchError) && (
                        <Grid item xs={12}>
                            <Alert className="w-full" severity="error">
                                Failed to build environment. Please try again.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            name="name"
                            className="w-full"
                            label="Name"
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="dockerfile"
                            name="dockerfile"
                            className="w-full"
                            label="Dockerfile"
                            type="file"
                            autoComplete="off"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            id="new-environment-button"
                            name="submit"
                            className="w-full"
                            type="submit"
                            variant="contained"
                            loading={createLoading || buildLoading}
                        >
                            <Typography className="p-2">Add</Typography>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
