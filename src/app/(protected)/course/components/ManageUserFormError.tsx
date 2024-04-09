import ComponentWrapper from "@/app/components/ComponentWrapper";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Box, Typography } from "@mui/material";

export default function ManageUserFormError() {
    return (
        <Box className="p-5">
            <ComponentWrapper Icon={FeedbackIcon} title="Error">
                <Box className="flex flex-col">
                    <Typography>
                        Sorry, but there was an error when loading manage user
                        form.
                    </Typography>
                </Box>
            </ComponentWrapper>
        </Box>
    );
}
