import { Box, Grid, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import TopBar from "./components/TopBar";
import TopBarPadding from "./components/TopBarPadding";
import workspace from "../assets/images/workspace.svg";
import FadedInImage from "./components/FadedInImage";
import FadedInTypography from "./components/FadedInTypography";
import FadedInButton from "./components/FadedInButton";

function MainContent() {
    return (
        <Grid container className="flex h-full">
            <Grid
                item
                className="flex justify-center items-center xs:max-xl:p-10"
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={5}
            >
                <Box className="max-w-xl px-6 space-y-4">
                    <FadedInTypography
                        variant="h3"
                        className="text-center font-medium"
                        color="secondary"
                        duration={1000}
                    >
                        A Web Platform For Code Assessment
                    </FadedInTypography>
                    <FadedInTypography
                        className="text-center"
                        variant="h6"
                        duration={1000}
                        delay={500}
                    >
                        Multipurpose Online Coding Assessment Platform (MOCAP)
                        eliminates the need for students to set up a coding
                        environment on their local machines.
                        <br />
                        MOCAP provides customizable and containerized coding
                        environments, feature-rich IDE, and customizable test
                        cases for students and teachers to work with.
                    </FadedInTypography>
                    <Box className="flex flex-row justify-evenly">
                        <FadedInButton
                            name="signin"
                            className="p-12"
                            variant="contained"
                            color="secondary"
                            href="/login"
                            duration={1000}
                            delay={500}
                        >
                            <Typography className="p-2">Sign in</Typography>
                        </FadedInButton>
                        <FadedInButton
                            name="register"
                            className="p-12"
                            variant="contained"
                            color="secondary"
                            href="/register"
                            duration={1000}
                            delay={500}
                        >
                            <Typography className="p-2">Register</Typography>
                        </FadedInButton>
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                className="flex items-center justify-end overflow-x-hidden xs:max-xl:justify-center"
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={7}
            >
                <Box className="relative w-fit h-fit left-44 select-none xs:max-xl:left-0 xs:max-xl:p-10">
                    <FadedInImage
                        className="w-5xl"
                        draggable={false}
                        src={workspace}
                        alt="workspace"
                        duration={1000}
                        delay={1000}
                        priority
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default async function Root() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/home");
    }

    return (
        <>
            <TopBar />
            {/* wrap a box so content won't cover by the SideMenu */}
            <Box className="flex min-h-screen">
                <Box
                    className="flex flex-col min-w-0 min-h-screen w-full"
                    component="main"
                >
                    <TopBarPadding />
                    <MainContent />
                </Box>
            </Box>
        </>
    );
}
