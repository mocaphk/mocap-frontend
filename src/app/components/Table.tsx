"use client";

import * as React from "react";
import {
    DataGrid,
    GridPagination,
    gridPageCountSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import { Box, LinearProgress, Popover, Typography } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import type { TablePaginationProps } from "@mui/material/TablePagination";

// https://mui.com/x/react-data-grid/components/
function CustomNoRowsOverlay() {
    return (
        <Box className="flex flex-col items-center justify-center h-full">
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                            fill="#f5f5f5"
                            fillOpacity="0.8"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                            fill="#aeb8c2"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                            fill="#f5f5f7"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                            fill="#dce0e6"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                        fill="#dce0e6"
                    />
                    <g
                        className="ant-empty-img-4"
                        transform="translate(149.65 15.383)"
                        fill="#fff"
                    >
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box className="my-1 select-none">No Result</Box>
        </Box>
    );
}

function Pagination({
    page,
    onPageChange,
    className,
}: Readonly<
    Pick<TablePaginationProps, "page" | "onPageChange" | "className">
>) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            color="secondary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event as any, newPage - 1);
            }}
        />
    );
}

function CustomPagination(props: any) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
}

export default function Table(props: React.ComponentProps<typeof DataGrid>) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [hoveredText, setHoveredText] = React.useState("");
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        const field = event.currentTarget.dataset.field!;
        const id = event.currentTarget.parentElement!.dataset.id!;

        const getRowId = props?.getRowId;

        let row = null;
        if (getRowId !== undefined) {
            row = props.rows.find((r) => getRowId(r) === id);
        } else {
            row = props.rows.find((r) => r.id === id);
        }
        setHoveredText(row?.[field] ?? "");
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <DataGrid
                {...props}
                sx={{
                    ...props?.sx,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    ".MuiDataGrid-columnSeparator": {
                        display: "none",
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "&.MuiDataGrid-root": {
                        border: "none",
                    },
                }}
                columns={props.columns.map((column, i) => {
                    return {
                        ...column,
                        headerAlign: "left",
                        disableExport: true,
                        // disableReorder: true,
                        flex: i === props.columns.length - 1 ? 1 : 0,
                    };
                })}
                slotProps={{
                    loadingOverlay: { color: "secondary" },
                    cell: {
                        onMouseEnter: handlePopoverOpen,
                        onMouseLeave: handlePopoverClose,
                    },
                    columnMenu: {
                        color: "secondary",
                    },
                    baseTextField: {
                        color: "secondary",
                    },
                    baseFormControl: {
                        color: "secondary",
                    },
                    baseSwitch: {
                        color: "secondary",
                    },
                }}
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: CustomNoRowsOverlay,
                    pagination: CustomPagination,
                }}
                getRowClassName={() => "cursor-pointer"}
                disableRowSelectionOnClick
                autoPageSize
            />
            <Popover
                sx={{
                    pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{`${hoveredText}`}</Typography>
            </Popover>
        </>
    );
}
