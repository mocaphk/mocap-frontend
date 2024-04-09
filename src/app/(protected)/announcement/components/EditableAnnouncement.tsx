import React from "react";
import ConfirmIconButton from "@/app/components/ConfirmIconButton";
import { Alert, Box, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import type { EditableAnnouncementProps } from "../types/EditableAnnouncementProps";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import type { CreateAnnouncementInput, UpdateAnnouncementInput } from "@schema";
import {
    useCreateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    useUpdateAnnouncementMutation,
} from "@/app/graphql/course/announcement.graphql";
import LoadingIconButton from "@/app/components/LoadingIconButton";

export default function EditableAnnouncement({
    isNew,
    id,
    courseId,
    title,
    content,
    setIsEditing,
    refetch,
}: Readonly<EditableAnnouncementProps>) {
    const confirmLeaveMsg = "Are you sure you want to discard your changes?";
    const confirmDeleteMsg =
        "Are you sure you want to delete this announcement?";

    const { replace } = useRouter();

    const [createFetchError, setCreateFetchError] =
        React.useState<boolean>(false);

    const [updateFetchError, setUpdateFetchError] =
        React.useState<boolean>(false);

    const [deleteFetchError, setDeleteFetchError] =
        React.useState<boolean>(false);

    const [createAnnouncement, { error: createError, loading: createLoading }] =
        useCreateAnnouncementMutation();

    const [updateAnnouncement, { error: updateError, loading: updateLoading }] =
        useUpdateAnnouncementMutation();

    const [deleteAnnouncement, { error: deleteError, loading: deleteLoading }] =
        useDeleteAnnouncementMutation();

    const onSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(formData.entries());

        // create if is new announcement
        if (isNew) {
            formValues.courseId = courseId;
            await handleCreate(formValues as CreateAnnouncementInput);
            return;
        }

        handleSave(formValues as UpdateAnnouncementInput);
    };

    const handleCreate = async (formValues: CreateAnnouncementInput) => {
        const result = await createAnnouncement({
            variables: {
                announcementInput: formValues,
            },
        });

        const newAnnouncement = result?.data?.createAnnouncement;

        const error =
            result?.errors !== undefined ||
            newAnnouncement === null ||
            newAnnouncement === undefined;

        setCreateFetchError(error);
        if (error) {
            return;
        }

        // redirect to the newly created announcement
        const newId = newAnnouncement.id;
        replace(`/announcement?id=${newId}&courseId=${courseId}`);
    };

    const handleSave = async (formValues: UpdateAnnouncementInput) => {
        const result = await updateAnnouncement({
            variables: {
                id: id,
                announcementInput: formValues,
            },
        });

        const updatedAnnouncement = result?.data?.updateAnnouncement;

        const error =
            result?.errors !== undefined ||
            updatedAnnouncement === null ||
            updatedAnnouncement === undefined;

        setUpdateFetchError(error);
        if (error) {
            return;
        }

        // refresh
        refetch();
        setIsEditing(false);
    };

    const handleCancel = () => {
        // if cancel on new announcement creation, redirect back to course page
        if (isNew) {
            redirectToCoursePage();
            return;
        }

        // else just set isEditing false
        setIsEditing(false);
    };

    const handleDelete = async () => {
        // delete announcement
        const result = await deleteAnnouncement({
            variables: {
                id: id,
            },
        });

        const deletedAnnouncement = result?.data?.deleteAnnouncement;

        const error =
            result?.errors !== undefined ||
            deletedAnnouncement === null ||
            deletedAnnouncement === undefined;

        setDeleteFetchError(error);
        if (error) {
            return;
        }

        // return back to course page
        redirectToCoursePage();
    };

    const redirectToCoursePage = () => {
        replace(`/course?id=${courseId}`);
    };

    return (
        <Box
            className="flex flex-col gap-5"
            component="form"
            onSubmit={onSubmit}
        >
            {(createError || createFetchError) && (
                <Alert className="w-full" severity="error">
                    Failed to create announcement. Please try again.
                </Alert>
            )}
            {(updateError || updateFetchError) && (
                <Alert className="w-full" severity="error">
                    Failed to update announcement. Please try again.
                </Alert>
            )}
            {(deleteError || deleteFetchError) && (
                <Alert className="w-full" severity="error">
                    Failed to delete announcement. Please try again.
                </Alert>
            )}
            <Box className="flex flex-row items-center justify-between">
                <TextField
                    id="title"
                    name="title"
                    className="w-[70%]"
                    label="Title"
                    type="text"
                    autoFocus={true}
                    autoComplete="off"
                    inputProps={{ maxLength: 255 }}
                    defaultValue={title}
                    required
                />
                <Box className="flex flex-row gap-2">
                    <LoadingIconButton
                        type="submit"
                        color="success"
                        className="w-fit h-fit"
                        loading={createLoading || updateLoading}
                        tabIndex={-1}
                    >
                        <SaveIcon />
                    </LoadingIconButton>
                    <ConfirmIconButton
                        Icon={CancelIcon}
                        color="error"
                        confirmBoxContent={confirmLeaveMsg}
                        onClick={handleCancel}
                        tabIndex={-1}
                    />
                    {!isNew && (
                        <ConfirmIconButton
                            Icon={DeleteIcon}
                            color="error"
                            confirmBoxContent={confirmDeleteMsg}
                            onClick={handleDelete}
                            loading={deleteLoading}
                            tabIndex={-1}
                        />
                    )}
                </Box>
            </Box>
            <TextField
                id="content"
                name="content"
                label="Content"
                type="text"
                autoComplete="off"
                fullWidth
                multiline
                minRows={8}
                // inputProps={{ maxLength: 255 }}
                defaultValue={content}
                required
            />
        </Box>
    );
}
