import psutil


def get_disk_info():
    """
    Collect disk usage information.
    """

    disk = psutil.disk_usage("/")

    return {
        "total_disk": round(disk.total / (1024 ** 3), 2),
        "used_disk": round(disk.used / (1024 ** 3), 2),
        "free_disk": round(disk.free / (1024 ** 3), 2),
        "disk_usage": disk.percent
    }
