import React from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Chip,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { UserEntry } from "./UserEntry";
import {
    useCreateCourseUserMutation,
    useDeleteCourseUserMutation,
    useGetUsersNotInCourseQuery,
    useSearchCourseUsersByUsernameQuery,
} from "@/app/graphql/course/course.graphql";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import ManageUserFormError from "./ManageUserFormError";
import { UserRole } from "@schema";
import type {
    CreateCourseUserInput,
    SearchCourseUsersByUsernameInput,
} from "@schema";
import { capitalizeFirstLetter } from "@/app/utils/string";
import { useSession } from "next-auth/react";
import NoResultAlert from "@/app/errors/noResultAlert";

export default function ManageUserForm({
    courseId,
}: Readonly<{ courseId: string }>) {
    const [username, setUsername] = React.useState<string>("");
    const [selectedRoles, setSelectedRoles] = React.useState<UserRole[]>([]);
    const [createUserError, setCreateUserError] =
        React.useState<boolean>(false);
    const [deleteUserError, setDeleteUserError] =
        React.useState<boolean>(false);

    const { data: session } = useSession();
    const {
        loading: loadingCourseUsers,
        error: courseUsersError,
        data: courseUsersData,
        refetch: refetchCourseUsers,
    } = useSearchCourseUsersByUsernameQuery({
        skip: !courseId,
        variables: {
            searchCourseUsersByUsernameInput: {
                courseId: courseId,
                username: "",
            },
        },
    });
    const {
        loading: loadingUsersNotInCourse,
        error: usersNotInCourseError,
        data: usersNotInCourseData,
        refetch: refetchUsersNotInCourse,
    } = useGetUsersNotInCourseQuery({
        skip: !courseId,
        variables: { courseId: courseId },
    });

    const [createCourseUser] = useCreateCourseUserMutation();
    const [deleteCourseUser] = useDeleteCourseUserMutation();

    const courseUsers = courseUsersData?.searchCourseUsersByUsername;
    const usersNotInCourse = usersNotInCourseData?.usersNotInCourse;

    const showErrorMessage =
        !loadingCourseUsers &&
        !loadingUsersNotInCourse &&
        (courseUsersData === undefined ||
            courseUsersError ||
            usersNotInCourseError ||
            courseUsers === undefined ||
            courseUsers === null ||
            usersNotInCourse === undefined ||
            usersNotInCourse === null);

    if (showErrorMessage) {
        return <ManageUserFormError />;
    }

    const onAddUserSubmit: React.ComponentProps<
        typeof Box
    >["onSubmit"] = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(
            formData.entries()
        ) as unknown as CreateCourseUserInput;
        formValues.roles = selectedRoles;
        formValues.courseId = courseId;

        const { errors } = await createCourseUser({
            variables: {
                courseUserInput: formValues,
            },
        });

        if (!errors) {
            refetchCourseUsers();
            refetchUsersNotInCourse();
            setUsername("");
            setSelectedRoles([]);
            setCreateUserError(false);
        } else {
            setCreateUserError(true);
        }
    };

    const onSearchSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(
            formData.entries()
        ) as unknown as SearchCourseUsersByUsernameInput;
        formValues.courseId = courseId;

        refetchCourseUsers({
            searchCourseUsersByUsernameInput: formValues,
        });
    };

    const handleRemoveStudent = async (id: string) => {
        const { errors } = await deleteCourseUser({
            variables: {
                courseId: courseId,
                userId: id,
            },
        });

        if (!errors) {
            refetchCourseUsers();
            refetchUsersNotInCourse();
            setDeleteUserError(false);
        } else {
            setDeleteUserError(true);
        }
    };

    return (
        <>
            <DialogTitle color="info.main">Add Student</DialogTitle>

            <Box
                id="add-user-form"
                component="form"
                onSubmit={onAddUserSubmit}
                className="w-full flex flex-col px-4"
            >
                {loadingUsersNotInCourse ? (
                    <>
                        <CustomSkeleton
                            sx={{ minWidth: 500, minHeight: 100 }}
                        />
                        <CustomSkeleton
                            sx={{ minWidth: 500, minHeight: 100 }}
                        />
                    </>
                ) : (
                    <Box className="flex flex-row w-full items-center gap-2">
                        <Box className="flex flex-col w-full gap-3">
                            {createUserError && (
                                <Alert className="w-full" severity="error">
                                    Failed to add user. Please try again.
                                </Alert>
                            )}
                            <Autocomplete
                                className="w-full"
                                value={username}
                                onChange={(event, newValue) => {
                                    setUsername(newValue ?? "");
                                }}
                                autoFocus={true}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="username"
                                        label="Username"
                                        required
                                    />
                                )}
                                sx={{
                                    minWidth: 500,
                                }}
                                options={
                                    usersNotInCourse?.map(
                                        (user) => user.username
                                    ) ?? []
                                }
                                autoHighlight
                            />
                            <Autocomplete
                                multiple
                                className="w-full"
                                autoFocus={true}
                                value={selectedRoles}
                                onChange={(event, newValue: string[]) => {
                                    setSelectedRoles(newValue as UserRole[]);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="roles"
                                        label="Roles"
                                    />
                                )}
                                sx={{
                                    minWidth: 500,
                                }}
                                options={Object.values(UserRole)}
                                getOptionLabel={(option) =>
                                    capitalizeFirstLetter(option.toLowerCase())
                                }
                                renderTags={(tagValue, getTagProps) => {
                                    return tagValue.map((option, index) => (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={option}
                                            label={capitalizeFirstLetter(
                                                option.toLowerCase()
                                            )}
                                        />
                                    ));
                                }}
                                autoHighlight
                                disableCloseOnSelect
                            />
                        </Box>

                        <IconButton
                            className="w-fit h-fit"
                            color="info"
                            aria-label="add users"
                            type="submit"
                        >
                            <PersonAddIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <DialogTitle color="info.main">Manage Student</DialogTitle>

            <Box
                id="filter-users-form"
                component="form"
                onSubmit={onSearchSubmit}
                className="w-full flex flex-col px-4"
            >
                {loadingCourseUsers ? (
                    <CustomSkeleton sx={{ minWidth: 500, minHeight: 100 }} />
                ) : (
                    <Box className="flex flex-col w-full gap-5">
                        {deleteUserError && (
                            <Alert className="w-full" severity="error">
                                Failed to delete user. Please try again.
                            </Alert>
                        )}
                        <Box className="flex flex-row w-full items-center gap-2">
                            <TextField
                                id="username"
                                name="username"
                                className="w-full"
                                sx={{
                                    minWidth: 500,
                                }}
                                label="Username"
                                type="text"
                                autoComplete="off"
                            />
                            <IconButton
                                className="w-fit h-fit"
                                color="info"
                                aria-label="filter students"
                                type="submit"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Box>
            {!loadingCourseUsers && (
                <Box
                    className="flex flex-col gap-3 min-h-[10rem] max-h-80 overflow-auto mx-3 my-3"
                    sx={{ scrollbarWidth: "thin" }}
                >
                    {!courseUsers || courseUsers.length === 0 ? (
                        <NoResultAlert />
                    ) : (
                        <>
                            {courseUsers?.map((user) => (
                                <UserEntry
                                    key={user.id}
                                    name={user.username}
                                    roles={user.roles}
                                    showDeleteButton={
                                        session?.user?.name !== user.username
                                    }
                                    deleteFunction={() =>
                                        handleRemoveStudent(user.id)
                                    }
                                    deleteConfirmBoxContent={`Are you sure you want to remove ${user.username} from this course?`}
                                    deleteRequireConfirm={true}
                                />
                            ))}
                        </>
                    )}
                </Box>
            )}
        </>
    );
}
