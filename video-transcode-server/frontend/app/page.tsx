// app/dashboard.tsx
'use client';

import { Box, Heading } from '@chakra-ui/react';
import JobStatus from './components/JobStatus';
import SettingsForm from './components/SettingsForm';
import SystemUtilization from './components/SystemUtilization';

const Dashboard: React.FC = () => (
    <Box p={5}>
        <Heading size="lg" mb={6}>
            Transcode Server Dashboard
        </Heading>
        <JobStatus />
        <SystemUtilization />
        <SettingsForm />
    </Box>
);

export default Dashboard;
