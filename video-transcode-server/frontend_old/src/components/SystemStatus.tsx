import React from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { fetchSystemLoad } from "../services/api";

interface SystemLoad {
    cpu_usage: string;
    memory_usage: string;
    total_memory: string;
    available_memory: string;
}

const SystemStatus: React.FC = () => {
    const { data, isLoading } = useQuery("systemLoad", fetchSystemLoad, {
        refetchInterval: 5000, // Poll every 5 seconds
    });

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Box p={5}>
            <Text>CPU Usage: {data?.data.cpu_usage}</Text>
            <Text>Memory Usage: {data?.data.memory_usage}</Text>
            <Text>Total Memory: {data?.data.total_memory}</Text>
            <Text>Available Memory: {data?.data.available_memory}</Text>
        </Box>
    );
};

export default SystemStatus;
