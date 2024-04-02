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
            views={["year", "month", "day", "hours", "minutes", "seconds"]}
            {...props}
            slotProps={{
                textField: {
                    name: props.name,
                    required: props.required,
                },
                ...props.slotProps,
            }}
        />
    );
}
