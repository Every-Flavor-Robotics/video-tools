class AppConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AppConfig, cls).__new__(cls)
            cls._instance._initialize_defaults()
        return cls._instance

    def _initialize_defaults(self):
        self.resolution = "1280x720"
        self.quality = 0
        self.cleanup_interval = 60  # in seconds
        self.retention_period = 86400  # in seconds

    def update_settings(
        self,
        resolution=None,
        quality=None,
        cleanup_interval=None,
        retention_period=None,
    ):
        if resolution is not None:
            self.resolution = resolution
        if quality is not None:
            self.quality = quality
        if cleanup_interval is not None:
            self.cleanup_interval = cleanup_interval
        if retention_period is not None:
            self.retention_period = retention_period

    def get_settings(self):
        return {
            "resolution": self.resolution,
            "quality": self.quality,
            "cleanup_interval": self.cleanup_interval,
            "retention_period": self.retention_period,
        }
