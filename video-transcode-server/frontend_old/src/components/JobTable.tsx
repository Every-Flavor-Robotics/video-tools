import React from "react";
import {
    Table,
    Spinner,
    Box,
    Heading,
    Text,
    Button,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { fetchJobs } from "../services/api";

interface Job {
    id: string;
    status: string;
    error?: string;
}

const JobTable: React.FC = () => {
    const { data, isLoading, refetch } = useQuery("jobs", fetchJobs);

    const refreshJobs = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>Job Status</Heading>
            <Button colorScheme="blue" mb={4} onClick={refreshJobs}>
                Refresh Jobs
            </Button>
            {data?.length === 0 ? (
                <Text>No jobs available</Text>
            ) : (
                <Table.Root variant="simple">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Error</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.map((job: Job) => (
                            <Table.Row key={job.id}>
                                <Table.Cell>{job.id}</Table.Cell>
                                <Table.Cell>{job.status}</Table.Cell>
                                <Table.Cell>{job.error || "None"}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Box>
    );
};

export default JobTable;
