import psutil


def get_memory_info():
    """
    Collect RAM usage information.
    """

    memory = psutil.virtual_memory()

    return {
        "total_memory": round(memory.total / (1024 ** 3), 2),
        "available_memory": round(memory.available / (1024 ** 3), 2),
        "used_memory": round(memory.used / (1024 ** 3), 2),
        "memory_usage": memory.percent
    }
