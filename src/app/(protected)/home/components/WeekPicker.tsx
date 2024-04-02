"use client";

import * as React from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";

import type { SxProps } from "@mui/material/styles";
import type Theme from "@/app/theme/Theme";

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
    isSelected: boolean;
    isHovered: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
    borderRadius: 0,
    ...(isSelected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.main,
        },
    }),
    ...(isHovered && {
        backgroundColor: theme.palette.secondary[theme.palette.mode],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "&:hover, &:focus": {
            backgroundColor: theme.palette.secondary[theme.palette.mode],
        },
    }),
    ...(day.day() === 0 && {
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
    }),
    ...(day.day() === 6 && {
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
    if (dayB == null) {
        return false;
    }

    return dayA.isSame(dayB, "week");
};

function Day(
    props: PickersDayProps<Dayjs> & {
        selectedDay?: Dayjs | null;
        hoveredDay?: Dayjs | null;
    }
) {
    const { day, selectedDay, hoveredDay, ...other } = props;

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={{ px: 2.5 }}
            disableMargin
            selected={false}
            isSelected={isInSameWeek(day, selectedDay)}
            isHovered={isInSameWeek(day, hoveredDay)}
        />
    );
}

export default function WeekPicker({
    value,
    setValue,
    hoveredDay,
    setHoveredDay,
    sx,
}: Readonly<{
    value: dayjs.Dayjs | null;
    setValue: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
    hoveredDay: dayjs.Dayjs | null;
    setHoveredDay: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
    sx: SxProps<typeof Theme>;
}>) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                sx={sx}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                slots={{ day: Day }}
                slotProps={{
                    day: (ownerState) =>
                        ({
                            selectedDay: value,
                            hoveredDay,
                            onPointerEnter: () => setHoveredDay(ownerState.day),
                            onPointerLeave: () => setHoveredDay(null),
                        }) as any,
                }}
            />
        </LocalizationProvider>
    );
}
