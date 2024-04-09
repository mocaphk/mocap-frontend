import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Box, Link, Typography } from "@mui/material";

export default function AnnouncementNotFoundPage({
    courseId,
}: Readonly<{
    courseId: string | null;
}>) {
    const courseLink = () => {
        if (courseId) {
            return `course?id=${courseId}`;
        }
        return "courses";
    };

    return (
        <CardWrapper>
            <ComponentWrapper
                Icon={FeedbackIcon}
                title="Announcement not found"
            >
                <Box className="flex flex-col gap-3">
                    <Typography>
                        Sorry, but the announcement you are searching for is not
                        available.
                    </Typography>
                    <Box>
                        <Link href={courseLink()} underline="hover">
                            « Back to course page
                        </Link>
                    </Box>
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
