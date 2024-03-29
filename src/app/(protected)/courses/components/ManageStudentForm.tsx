import React from "react";
import { Box, DialogTitle, IconButton, TextField } from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { StudentEntry } from "./StudentEntry";

export default function ManageStudentForm() {
    // add students
    const [addUIDs, setAddUIDs] = React.useState("");

    const handleAddUIDsChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setAddUIDs(value);
    };

    // filter students
    const [filter, setFilter] = React.useState({
        name: "",
        uid: "",
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setFilter((values) => ({ ...values, [name]: value }));
    };

    // fetch students base on filter
    const studentsTemplate = [
        {
            uid: "3035787084",
            name: "John Tseung1",
        },
        {
            uid: "3035787094",
            name: "John Tseung2",
        },
        {
            uid: "3035787104",
            name: "John Tseung3",
        },
        {
            uid: "3035787114",
            name: "John Tseung4",
        },
        {
            uid: "3035787124",
            name: "John Tseung5",
        },
        {
            uid: "3035787134",
            name: "John Tseung6",
        },
        {
            uid: "3035787144",
            name: "John Tseung7",
        },
        {
            uid: "3035787154",
            name: "John Tseung8",
        },
        {
            uid: "3035787164",
            name: "John Tseung9",
        },
    ];

    // remove student function
    const handleRemoveStudent = (uid: string) => {
        // remove student with uid from this course
        console.log(`remove student with uid ${uid}`);
    };

    return (
        <>
            <DialogTitle color="info.main">Add Student</DialogTitle>

            <Box
                id="add-students-form"
                component="form"
                // TODO: send add students request with this action
                action="ToBeChanged"
                method="post"
                className="w-full flex flex-col px-4 my-2"
            >
                <Box className="flex flex-row w-full">
                    <TextField
                        id="studentUIDs"
                        name="studentUIDs"
                        className="w-full"
                        label="Student UIDs"
                        color="secondary"
                        type="text"
                        placeholder="e.g. 3035787084, 3035787011, ..."
                        autoFocus={true}
                        autoComplete="off"
                        value={addUIDs}
                        onChange={handleAddUIDsChange}
                        required
                    />
                    <IconButton
                        color="info"
                        sx={{ m: 1 }}
                        aria-label="add students"
                        type="submit"
                    >
                        <PersonAddIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogTitle color="info.main">Manage Student</DialogTitle>

            <Box
                id="filter-students-form"
                component="form"
                // TODO: filter students with this action
                // empty means no filter, return back all students
                action="ToBeChanged"
                method="post"
                className="w-full flex flex-col px-4 my-2"
            >
                <Box className="flex flex-row w-full">
                    <Box className="flex flex-row gap-3">
                        <TextField
                            id="filterName"
                            name="name"
                            className="w-full"
                            label="Student Name"
                            color="secondary"
                            type="text"
                            autoFocus={true}
                            autoComplete="off"
                            value={filter.name}
                            onChange={handleFilterChange}
                        />
                        <TextField
                            id="filterUID"
                            name="uid"
                            className="w-full"
                            label="Student UID"
                            color="secondary"
                            type="text"
                            autoFocus={true}
                            autoComplete="off"
                            value={filter.uid}
                            onChange={handleFilterChange}
                        />
                    </Box>
                    <IconButton
                        color="info"
                        sx={{ m: 1 }}
                        aria-label="filter students"
                        type="submit"
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box
                className="flex flex-col gap-3 min-h-[10rem] max-h-80 overflow-auto mx-3 my-3"
                sx={{ scrollbarWidth: "thin" }}
            >
                {studentsTemplate.map((student) => (
                    <StudentEntry
                        key={student.uid}
                        name={student.name}
                        uid={student.uid}
                        showDeleteButton={true}
                        deleteFunction={() => handleRemoveStudent(student.uid)}
                        deleteConfirmBoxContent={`Are you sure you want to remove ${student.name} (UID: ${student.uid}) from this course?`}
                        deleteRequireConfirm={true}
                    />
                ))}
            </Box>
        </>
    );
}
