import CardWrapper from "@/app/components/CardWrapper";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { Box } from "@mui/material";

export default function LoadingAssignmentPage() {
    return (
        <CardWrapper>
            <Box>
                <CustomSkeleton width={500} />
                <CustomSkeleton width={200} />
                <CustomSkeleton sx={{ minWidth: "100%", minHeight: 300 }} />
            </Box>
        </CardWrapper>
    );
}
