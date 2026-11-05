import psutil


def get_cpu_info():
    """
    Collect CPU usage information.
    """

    cpu_usage = psutil.cpu_percent(interval=1)

    cpu_count = psutil.cpu_count(logical=True)

    cpu_frequency = psutil.cpu_freq()

    return {
        "cpu_usage": cpu_usage,
        "cpu_count": cpu_count,
        "cpu_frequency": cpu_frequency.current if cpu_frequency else None
    }
