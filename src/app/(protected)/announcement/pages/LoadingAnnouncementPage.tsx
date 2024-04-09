import CardWrapper from "@/app/components/CardWrapper";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { Box } from "@mui/material";

export default function LoadingAnnouncementPage() {
    return (
        <CardWrapper>
            <Box className="flex flex-col">
                <CustomSkeleton width="40%" height={60} />
                <CustomSkeleton width="20%" height={30} />
                <CustomSkeleton width="70%" height={80} sx={{ mt: 1 }} />
                <CustomSkeleton width="100%" height={400} sx={{ mt: -10 }} />
            </Box>
        </CardWrapper>
    );
}
