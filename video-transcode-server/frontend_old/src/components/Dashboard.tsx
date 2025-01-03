import React from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { fetchJobs } from "../services/api";

interface Job {
    id: string;
    status: string;
    error?: string;
}

const Dashboard: React.FC = () => {
    const { data, isLoading } = useQuery("jobs", fetchJobs);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Box p={5}>
            <Heading mb={4}>Job Status</Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Status</Th>
                        <Th>Error</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.data.map((job: Job) => (
                        <Tr key={job.id}>
                            <Td>{job.id}</Td>
                            <Td>{job.status}</Td>
                            <Td>{job.error || "None"}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default Dashboard;
