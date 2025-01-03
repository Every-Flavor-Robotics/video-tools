'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
    useToast,
} from '@chakra-ui/react';

const SettingsForm: React.FC = () => {
    const [resolution, setResolution] = useState('1280x720');
    const [quality, setQuality] = useState<number | ''>(9);
    const [cleanupInterval, setCleanupInterval] = useState<number | ''>(60);
    const [retentionPeriod, setRetentionPeriod] = useState<number | ''>(3600);
    const toast = useToast();

    // Fetch current settings from the backend
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:8000/settings/');
                if (response.ok) {
                    const data = await response.json();
                    setResolution(data.resolution);
                    setQuality(data.quality);
                    setCleanupInterval(data.cleanup_interval);
                    setRetentionPeriod(data.retention_period);
                } else {
                    console.error('Failed to fetch settings');
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);

    // Handle form submission
    const handleSubmit = async () => {
        // Validate inputs before submission
        if (
            !resolution ||
            quality === '' ||
            cleanupInterval === '' ||
            retentionPeriod === ''
        ) {
            toast({
                title: 'Please fill in all fields with valid values.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/settings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resolution,
                    quality,
                    cleanup_interval: cleanupInterval,
                    retention_period: retentionPeriod,
                }),
            });

            if (response.ok) {
                toast({
                    title: 'Settings updated successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Failed to update settings.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast({
                title: 'An error occurred.',
                description: 'Unable to update settings.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5}>
            <Heading size="md" mb={4}>
                Settings Configuration
            </Heading>
            <FormControl mb={3}>
                <FormLabel>Resolution</FormLabel>
                <Input
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    onBlur={() => {
                        if (!resolution) setResolution('1280x720');
                    }}
                />
            </FormControl>
            <FormControl mb={3}>
                <FormLabel>Quality</FormLabel>
                <NumberInput
                    value={quality === '' ? '' : quality}
                    onChange={(valueString) => {
                        if (valueString === '') {
                            setQuality('');
                        } else {
                            const parsed = parseInt(valueString);
                            if (!isNaN(parsed)) setQuality(parsed);
                        }
                    }}
                    onBlur={() => {
                        if (quality === '') setQuality(9);
                    }}
                    min={1}
                    max={10}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl mb={3}>
                <FormLabel>Cleanup Interval (seconds)</FormLabel>
                <NumberInput
                    value={cleanupInterval === '' ? '' : cleanupInterval}
                    onChange={(valueString) => {
                        if (valueString === '') {
                            setCleanupInterval('');
                        } else {
                            const parsed = parseInt(valueString);
                            if (!isNaN(parsed)) setCleanupInterval(parsed);
                        }
                    }}
                    onBlur={() => {
                        if (cleanupInterval === '') setCleanupInterval(60);
                    }}
                    min={10}
                    max={3600}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl mb={3}>
                <FormLabel>Retention Period (seconds)</FormLabel>
                <NumberInput
                    value={retentionPeriod === '' ? '' : retentionPeriod}
                    onChange={(valueString) => {
                        if (valueString === '') {
                            setRetentionPeriod('');
                        } else {
                            const parsed = parseInt(valueString);
                            if (!isNaN(parsed)) setRetentionPeriod(parsed);
                        }
                    }}
                    onBlur={() => {
                        if (retentionPeriod === '') setRetentionPeriod(3600);
                    }}
                    min={600}
                    max={86400}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <Button colorScheme="blue" onClick={handleSubmit}>
                Save Settings
            </Button>
        </Box>
    );
};

export default SettingsForm;
