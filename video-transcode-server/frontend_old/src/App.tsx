import React from "react";
import { Box, Heading, Container } from "@chakra-ui/react";
import JobTable from "./components/JobTable";
import SystemStatus from "./components/SystemStatus";
import SettingsForm from "./components/SettingsForm";

const App: React.FC = () => {
    return (
        <Container maxW="container.lg" p={5}>
            <Box mb={6}>
                <Heading size="lg" mb={4}>
                    Transcode Server Dashboard
                </Heading>
                <SystemStatus />
            </Box>

            <Box mb={6}>
                <JobTable />
            </Box>

            <Box>
                <SettingsForm />
            </Box>
        </Container>
    );
};

export default App;
