from app.collectors.cpu import get_cpu_info
from app.collectors.memory import get_memory_info
from app.collectors.disk import get_disk_info
from app.collectors.system import get_system_info


def get_all_system_info():
    """
    Collect all system monitoring information.
    """

    return {
        "cpu": get_cpu_info(),
        "memory": get_memory_info(),
        "disk": get_disk_info(),
        "system": get_system_info()
    }
