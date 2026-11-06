// Update circular progress bar
function updateProgressCircle(elementId, value) {
    const circle = document.getElementById(elementId);

    const percentage = Math.max(0, Math.min(100, value));

    const degrees = percentage * 3.6;

    circle.style.background = `
        conic-gradient(
            #38bdf8 0deg,
            #38bdf8 ${degrees}deg,
            #334155 ${degrees}deg,
            #334155 360deg
        )
    `;
}

// Fetch system information
async function fetchSystemInfo() {
    try {
        const response = await fetch("/api/system");

        if (!response.ok) {
            throw new Error("Failed to fetch system information");
        }

        const data = await response.json();

        // CPU Usage
        document.getElementById("cpu-usage").textContent =
            `${data.cpu.cpu_usage}%`;

        updateProgressCircle("cpu-circle", data.cpu.cpu_usage);

        // Memory Usage
        document.getElementById("memory-usage").textContent =
            `${data.memory.memory_usage}%`;

        updateProgressCircle("memory-circle", data.memory.memory_usage);

        // Disk Usage
        document.getElementById("disk-usage").textContent =
            `${data.disk.disk_usage}%`;

        updateProgressCircle("disk-circle", data.disk.disk_usage);

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

// Refresh every 2 seconds
setInterval(fetchSystemInfo, 2000);
