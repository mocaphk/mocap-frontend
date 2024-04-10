import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Alert, Box, Link } from "@mui/material";

export default function ErrorPage({
    title,
    message,
    returnMessage,
    returnLink,
}: Readonly<{
    title: string;
    message: string;
    returnMessage: string;
    returnLink: string;
}>) {
    return (
        <CardWrapper>
            <ComponentWrapper Icon={FeedbackIcon} title={title}>
                <Box className="flex flex-col gap-3">
                    <Alert severity="error">{message}</Alert>
                    <Box>
                        <Link href={returnLink} underline="hover">
                            « {returnMessage}
                        </Link>
                    </Box>
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
