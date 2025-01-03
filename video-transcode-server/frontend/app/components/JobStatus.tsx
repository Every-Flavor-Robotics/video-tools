'use client';

import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Heading } from '@chakra-ui/react';

interface Job {
    id: string;
    status: string;
    error: string | null;
}

const JobStatus: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:8000/jobs/');
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        // Fetch jobs immediately upon component mount
        fetchJobs();

        // Set up interval to fetch jobs every 5 seconds
        const intervalId = setInterval(fetchJobs, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <Box p={5}>
            <Heading size="md" mb={4}>
                Job Status
            </Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Job ID</Th>
                        <Th>Status</Th>
                        <Th>Error</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {jobs.map((job) => (
                        <Tr key={job.id}>
                            <Td>{job.id}</Td>
                            <Td>{job.status}</Td>
                            <Td>{job.error || 'None'}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default JobStatus;
