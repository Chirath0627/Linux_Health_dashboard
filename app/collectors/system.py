import psutil
import platform
from datetime import datetime


def get_system_info():
    """
    Collect general system information.
    """

    boot_time = psutil.boot_time()

    uptime_seconds = datetime.now().timestamp() - boot_time

    uptime_hours = round(uptime_seconds / 3600, 2)

    return {
        "hostname": platform.node(),
        "operating_system": platform.system(),
        "os_release": platform.release(),
        "architecture": platform.machine(),
        "processor": platform.processor(),
        "uptime_hours": uptime_hours
    }
