import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function DateTimeCalender(
    props: React.ComponentProps<typeof DateTimePicker> & {
        name?: string;
        required?: boolean;
    }
) {
    return (
        <DateTimePicker
            format="YYYY-MM-DD HH:mm:ss"
            views={["day", "hours", "minutes", "seconds"]}
            {...props}
            slotProps={{
                digitalClockSectionItem: {
                    sx: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "&.Mui-selected": {
                            backgroundColor: "secondary.main",
                            color: "secondary.contrastText",
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "&:hover, &:focus": {
                            backgroundColor: "secondary.dark",
                            color: "secondary.contrastText",
                        },
                    },
                },
                day: {
                    sx: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "&.Mui-selected": {
                            backgroundColor: "secondary.main",
                            color: "secondary.contrastText",
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "&:hover, &:focus": {
                            backgroundColor: "secondary.dark",
                            color: "secondary.contrastText",
                        },
                    },
                },
                textField: {
                    name: props.name,
                    color: "secondary",
                    required: props.required,
                },
                ...props.slotProps,
            }}
        />
    );
}
