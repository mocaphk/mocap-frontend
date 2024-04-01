import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Box, Link, Typography } from "@mui/material";

export default function AssignmentNotFoundPage({
    year,
    courseCode,
}: Readonly<{
    year: string | null;
    courseCode: string | null;
}>) {
    const courseLink = () => {
        if (courseCode && year) {
            return `course?courseCode=${courseCode}&year=${year}`;
        }
        return "courses";
    };

    return (
        <CardWrapper>
            <ComponentWrapper Icon={FeedbackIcon} title="Assignment not found">
                <Box className="flex flex-col gap-3">
                    <Typography>
                        Sorry, but the assignment you are searching for is not
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
