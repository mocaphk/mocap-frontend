"use client";

import * as React from "react";
import {
    DataGrid,
    GridPagination,
    gridPageCountSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import { LinearProgress, Popover, Typography } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import type { TablePaginationProps } from "@mui/material/TablePagination";
import NoResult from "../errors/noResult";

// https://mui.com/x/react-data-grid/components/
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
                    cell: {
                        onMouseEnter: handlePopoverOpen,
                        onMouseLeave: handlePopoverClose,
                    },
                }}
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: NoResult,
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
