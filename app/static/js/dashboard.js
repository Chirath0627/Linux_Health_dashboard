// Fetch system information from Flask API
async function fetchSystemInfo() {
    try {
        const response = await fetch("/api/system");

        if (!response.ok) {
            throw new Error("Failed to fetch system information");
        }

        const data = await response.json();

        // CPU Information
        document.getElementById("cpu-usage").textContent =
            `${data.cpu.cpu_usage}%`;

        // Memory Information
        document.getElementById("memory-usage").textContent =
            `${data.memory.memory_usage}%`;

        // Disk Information
        document.getElementById("disk-usage").textContent =
            `${data.disk.disk_usage}%`;

        // System Information
        document.getElementById("hostname").textContent =
            data.system.hostname;

        document.getElementById("os").textContent =
            `${data.system.operating_system} ${data.system.os_release}`;

        document.getElementById("architecture").textContent =
            data.system.architecture;

        document.getElementById("uptime").textContent =
            `${data.system.uptime_hours} hours`;

    } catch (error) {
        console.error("Error fetching system information:", error);
    }
}

// Initial data fetch
fetchSystemInfo();

// Refresh system information every 2 seconds
setInterval(fetchSystemInfo, 2000);
