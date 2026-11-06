
// Chart configuration
const MAX_DATA_POINTS = 20;

const timeLabels = [];
const cpuHistory = [];
const memoryHistory = [];

// Create CPU Chart
const cpuChart = new Chart(
    document.getElementById("cpu-chart"),
    {
        type: "line",
        data: {
            labels: timeLabels,
            datasets: [{
                label: "CPU Usage (%)",
                data: cpuHistory,
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + "%"
                    }
                }
            }
        }
    }
);

// Create Memory Chart
const memoryChart = new Chart(
    document.getElementById("memory-chart"),
    {
        type: "line",
        data: {
            labels: timeLabels,
            datasets: [{
                label: "Memory Usage (%)",
                data: memoryHistory,
                borderColor: "#a78bfa",
                backgroundColor: "rgba(167, 139, 250, 0.15)",
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + "%"
                    }
                }
            }
        }
    }
);

// Update chart history
function updateCharts(cpuUsage, memoryUsage) {
    const currentTime = new Date().toLocaleTimeString();

    timeLabels.push(currentTime);
    cpuHistory.push(cpuUsage);
    memoryHistory.push(memoryUsage);

    // Keep only the latest 20 data points
    if (timeLabels.length > MAX_DATA_POINTS) {
        timeLabels.shift();
        cpuHistory.shift();
        memoryHistory.shift();
    }

    cpuChart.update();
    memoryChart.update();
}

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

// Update system health alerts
updateSystemAlerts(data);

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

        // Update performance charts
        updateCharts(
            data.cpu.cpu_usage,
            data.memory.memory_usage
        );

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

// Check system health and generate alerts
function updateSystemAlerts(data) {
    const alertContainer = document.getElementById("alert-container");

    const resources = [
        {
            name: "CPU Usage",
            value: data.cpu.cpu_usage
        },
        {
            name: "Memory Usage",
            value: data.memory.memory_usage
        },
        {
            name: "Disk Usage",
            value: data.disk.disk_usage
        }
    ];

    const alerts = [];

    resources.forEach(resource => {
        if (resource.value >= 90) {
            alerts.push({
                level: "critical",
                message: `Critical: ${resource.name} is at ${resource.value}%.`
            });
        } else if (resource.value >= 80) {
            alerts.push({
                level: "warning",
                message: `Warning: High ${resource.name} detected (${resource.value}%).`
            });
        }
    });

    if (alerts.length === 0) {
        alertContainer.innerHTML = `
            <p class="no-alerts">
                All systems are running normally.
            </p>
        `;
        return;
    }

    alertContainer.innerHTML = alerts.map(alert => `
        <div class="alert ${alert.level}">
            ${alert.message}
        </div>
    `).join("");
}
