const SettingsForm: React.FC = () => {
    const [resolution, setResolution] = useState("1280x720");
    const [quality, setQuality] = useState(9);
    const [cleanupInterval, setCleanupInterval] = useState(60);
    const [retentionPeriod, setRetentionPeriod] = useState(3600);

    const handleSubmit = async () => {
        await updateSettings({
            resolution,
            quality,
            cleanup_interval: cleanupInterval,
            retention_period: retentionPeriod,
        });
        alert("Settings Updated!");
    };

    return (
        <Box p={5}>
            <Field label="Resolution" mb={3}>
                <Input
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                />
            </Field>

            <Field label="Quality" mb={3}>
                <NumberInput.Root
                    value={quality}
                    onValueChange={(valueString) => setQuality(Number(valueString))}
                    min={1}
                    max={10}
                >
                    <NumberInput.Field />
                    <NumberInput.Control>
                        <NumberInput.IncrementTrigger />
                        <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                </NumberInput.Root>
            </Field>

            <Field label="Cleanup Interval (seconds)" mb={3}>
                <NumberInput.Root
                    value={cleanupInterval}
                    onValueChange={(valueString) => setCleanupInterval(Number(valueString))}
                    min={10}
                    max={3600}
                >
                    <NumberInput.Field />
                    <NumberInput.Control>
                        <NumberInput.IncrementTrigger />
                        <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                </NumberInput.Root>
            </Field>

            <Field label="Retention Period (seconds)" mb={3}>
                <NumberInput.Root
                    value={retentionPeriod}
                    onValueChange={(valueString) => setRetentionPeriod(Number(valueString))}
                    min={600}
                    max={86400}
                >
                    <NumberInput.Field />
                    <NumberInput.Control>
                        <NumberInput.IncrementTrigger />
                        <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                </NumberInput.Root>
            </Field>

            <Button colorScheme="blue" onClick={handleSubmit}>
                Save Settings
            </Button>
        </Box>
    );
};

export default SettingsForm;
