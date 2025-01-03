'use client';

import { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

interface SystemLoad {
    cpu_usage: string;
    memory_usage: string;
    total_memory: string;
    available_memory: string;
}

const SystemUtilization: React.FC = () => {
    const [systemLoad, setSystemLoad] = useState<SystemLoad | null>(null);

    const fetchSystemLoad = async () => {
        try {
            const response = await fetch('http://localhost:8000/system_load/');
            const data = await response.json();
            setSystemLoad(data);
        } catch (error) {
            console.error('Error fetching system load:', error);
        }
    };

    useEffect(() => {
        // Fetch system load immediately upon component mount
        fetchSystemLoad();

        // Set up interval to fetch system load every second
        const intervalId = setInterval(fetchSystemLoad, 1000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <Box p={5}>
            <Heading size="md" mb={4}>
                System Utilization
            </Heading>
            {systemLoad ? (
                <>
                    <Text>CPU Usage: {systemLoad.cpu_usage}</Text>
                    <Text>Memory Usage: {systemLoad.memory_usage}</Text>
                    <Text>Total Memory: {systemLoad.total_memory}</Text>
                    <Text>Available Memory: {systemLoad.available_memory}</Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </Box>
    );
};

export default SystemUtilization;
