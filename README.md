# Linux System Health Dashboard

A real-time Linux system monitoring dashboard built with **Python**,
**Flask**, **psutil**, **HTML**, **CSS**, **JavaScript**, and
**Chart.js**.

The application collects system resource information from the Ubuntu
machine and displays it in a browser. It currently monitors CPU, memory
(RAM), disk usage, system information, performance history, and system
health alerts.

------------------------------------------------------------------------

## Table of Contents

-   [1. Project Overview](#1-project-overview)
-   [2. Features](#2-features)
-   [3. Technologies Used](#3-technologies-used)
-   [4. How the Application Works](#4-how-the-application-works)
-   [5. Project Structure](#5-project-structure)
-   [6. Requirements](#6-requirements)
-   [7. Installation and Setup](#7-installation-and-setup)
-   [8. Running the Application](#8-running-the-application)
-   [9. Running Tests](#9-running-tests)
-   [10. API Endpoint](#10-api-endpoint)
-   [11. System Health Alert
    Thresholds](#11-system-health-alert-thresholds)
-   [12. Commands Used During
    Development](#12-commands-used-during-development)
-   [13. Troubleshooting and Fixes](#13-troubleshooting-and-fixes)
-   [14. Git and GitHub Workflow](#14-git-and-github-workflow)
-   [15. Current Status and Future
    Improvements](#15-current-status-and-future-improvements)

------------------------------------------------------------------------

## 1. Project Overview

The **Linux System Health Dashboard** is a web-based application
designed to monitor the health and performance of a Linux system.

Instead of repeatedly running Linux terminal commands to check resource
usage, users can open the dashboard in a web browser and view important
system information in one place.

The Python backend collects system metrics using the `psutil` library.
Flask exposes these metrics through an API endpoint. The frontend uses
JavaScript to request the latest metrics and update the dashboard every
two seconds.

This project was developed and tested in an **Ubuntu virtual machine**.

## 2. Features

### System Overview

Displays three circular resource-usage indicators:

-   CPU usage percentage
-   Memory (RAM) usage percentage
-   Disk usage percentage

### System Health Alerts

Displays alerts based on the current CPU, memory, and disk usage:

-   Normal: all monitored resources are below 80%.
-   Warning: a resource is at least 80% but below 90%.
-   Critical: a resource is at least 90%.

### Performance History

Uses Chart.js line charts to show recent CPU and memory usage readings.
The dashboard keeps the latest 20 data points in each chart.

### System Information

Displays general information about the monitored machine, including:

-   Hostname
-   Operating system and release
-   System architecture
-   System uptime

### Automatic Refresh

The frontend requests updated system information every **2 seconds**.

------------------------------------------------------------------------

## 3. Technologies Used

  Technology   Purpose
  ------------ -------------------------------------------------
  Python       Backend programming language
  Flask        Web application and API
  psutil       Collects CPU, memory, disk, and system metrics
  HTML         Dashboard structure
  CSS          Dashboard styling and responsive layout
  JavaScript   Fetches API data and updates dashboard elements
  Chart.js     Displays CPU and memory history charts
  pytest       Runs automated backend tests
  Git          Version control
  GitHub       Remote source-code repository
  Ubuntu       Development and execution environment

`Flask-SocketIO` was installed during the initial environment setup, but
the current dashboard refreshes through periodic JavaScript `fetch()`
requests. The current implementation does not depend on Socket.IO for
its two-second refresh.

------------------------------------------------------------------------

## 4. How the Application Works

The application has three main parts.

### 4.1 Backend -- Collect system information

The collector modules use `psutil` to read system metrics:

-   `cpu.py` collects CPU usage, logical CPU count, and CPU frequency.
-   `memory.py` collects total, available, and used RAM, plus memory
    usage percentage.
-   `disk.py` collects total, used, and free disk space, plus disk usage
    percentage.
-   `system.py` collects hostname, operating system, release,
    architecture, and uptime.

The `get_all_system_info()` function combines the collected information
into one Python dictionary.

### 4.2 Flask API -- Provide the information

The Flask application provides the `/api/system` endpoint.

When the browser requests this endpoint, Flask calls
`get_all_system_info()` and returns the result as JSON.

### 4.3 Frontend -- Display live information

The browser loads `index.html`, `style.css`, and `dashboard.js`.

JavaScript sends a request to `/api/system`, reads the JSON response,
and updates:

-   Circular usage indicators
-   Health alerts
-   CPU and memory history charts
-   System information labels

The first request runs when the page loads. Further requests run every
two seconds using `setInterval()`.

### Data flow

``` text
Ubuntu Linux system
       |
       v
psutil collectors
(CPU / Memory / Disk / System)
       |
       v
get_all_system_info()
       |
       v
Flask API: GET /api/system
       |
       v
JSON response
       |
       v
dashboard.js
       |
       +----> Circular usage indicators
       +----> System health alerts
       +----> CPU and memory charts
       +----> System information
```

------------------------------------------------------------------------

## 5. Project Structure

``` text
linux-system-health-dashboard/
│
├── app/
│   ├── __init__.py
│   ├── config.py
│   │
│   ├── collectors/
│   │   ├── __init__.py
│   │   ├── cpu.py
│   │   ├── memory.py
│   │   ├── disk.py
│   │   └── system.py
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── dashboard.py
│   │   └── api.py
│   │
│   ├── templates/
│   │   └── index.html
│   │
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── dashboard.js
│
├── tests/
│   ├── __init__.py
│   └── test_api.py
│
├── venv/
├── .gitignore
├── README.md
├── requirements.txt
└── run.py
```

**Note:** The current main Flask application and routes are defined
directly in `run.py`. The `app/routes/` files and some
package/configuration files are part of the project structure, but the
current `run.py` implementation is the entry point used to start the
dashboard.

The `venv/` directory is created locally and should not be committed to
Git.

------------------------------------------------------------------------

## 6. Requirements

The project was developed in an Ubuntu environment with:

-   Ubuntu Linux
-   Python 3.14.4
-   pip 25.1.1
-   Git 2.53.0

The application dependencies are:

-   `Flask`
-   `psutil`
-   `Flask-SocketIO`
-   `pytest` (for tests)

The exact installed package versions for the project environment are
recorded in `requirements.txt`.

------------------------------------------------------------------------

## 7. Installation and Setup

Follow these steps on a fresh Ubuntu installation.

### Step 1 -- Update package information

``` bash
sudo apt update
```

This refreshes the package lists used by Ubuntu's package manager.

### Step 2 -- Install Python, pip, virtual environment support, and Git

``` bash
sudo apt install python3 python3-pip python3-venv git -y
```

If Ubuntu reports that a version-specific virtual environment package is
required, install the package matching the installed Python version. For
the development environment used in this project:

``` bash
sudo apt install python3.14-venv -y
```

### Step 3 -- Verify the installed tools

``` bash
python3 --version
pip3 --version
git --version
```

### Step 4 -- Create the project directory

``` bash
mkdir linux-system-health-dashboard
cd linux-system-health-dashboard
```

If the project directory already exists, do not create another one.
Navigate to the existing directory:

``` bash
cd ~/linux-system-health-dashboard
```

### Step 5 -- Create a Python virtual environment

``` bash
python3 -m venv venv
```

A virtual environment keeps this project's Python dependencies separate
from system-wide Python packages.

### Step 6 -- Activate the virtual environment

``` bash
source venv/bin/activate
```

After activation, the terminal prompt should show `(venv)`.

Activate the virtual environment whenever opening a new terminal to work
on the project.

### Step 7 -- Install project dependencies

``` bash
pip install psutil flask flask-socketio pytest
```

### Step 8 -- Save dependencies

``` bash
pip freeze > requirements.txt
```

This records the installed package versions so the environment can be
recreated later.

### Step 9 -- Create the project folders

Run these commands from the project root:

``` bash
mkdir -p app/collectors
mkdir -p app/routes
mkdir -p app/templates
mkdir -p app/static/css
mkdir -p app/static/js
mkdir -p tests
```

Create Python package marker files where needed:

``` bash
touch app/__init__.py
touch app/collectors/__init__.py
touch app/routes/__init__.py
touch tests/__init__.py
```

### Step 10 -- Create the `.gitignore` file

The `.gitignore` file prevents generated files and the virtual
environment from being committed.

Example:

``` gitignore
venv/
__pycache__/
*.pyc
.env
.pytest_cache/
.git_corrupted_backup/
```

------------------------------------------------------------------------

## 8. Running the Application

### Step 1 -- Open a terminal and navigate to the project

``` bash
cd ~/linux-system-health-dashboard
```

### Step 2 -- Activate the virtual environment

``` bash
source venv/bin/activate
```

### Step 3 -- Start the Flask application

``` bash
python run.py
```

The development server is configured to run on port `5000` and listens
on `0.0.0.0`.

### Step 4 -- Open the dashboard

Open a browser in the Ubuntu environment and visit:

``` text
http://127.0.0.1:5000
```

The dashboard should load and begin updating the system information
automatically.

### Step 5 -- Stop the application

Return to the terminal where Flask is running and press:

``` text
Ctrl + C
```

### Important: Starting the project after a VM restart

The virtual environment does not automatically activate when Ubuntu
restarts. Run these commands again:

``` bash
cd ~/linux-system-health-dashboard
source venv/bin/activate
python run.py
```

------------------------------------------------------------------------

## 9. Running Tests

The project contains automated API tests in `tests/test_api.py`.

Make sure the virtual environment is active:

``` bash
cd ~/linux-system-health-dashboard
source venv/bin/activate
```

Run the tests:

``` bash
pytest -v
```

The current tests verify:

1.  The home page returns HTTP status `200`, returns HTML, and contains
    the dashboard title.
2.  The `/api/system` endpoint returns HTTP status `200` and includes
    the `cpu`, `memory`, `disk`, and `system` data groups.

Expected test result:

``` text
============================= test session starts =============================
...
tests/test_api.py::test_home_endpoint PASSED
tests/test_api.py::test_system_endpoint PASSED

============================== 2 passed ======================================
```

The exact execution time and pytest output may differ between machines.

------------------------------------------------------------------------

## 10. API Endpoint

### GET `/api/system`

Returns the current system metrics in JSON format.

Example request:

``` bash
curl http://127.0.0.1:5000/api/system
```

The response contains four main objects:

``` json
{
  "cpu": {
    "cpu_usage": 12.5,
    "cpu_count": 4,
    "cpu_frequency": 2400.0
  },
  "memory": {
    "total_memory": 8.0,
    "available_memory": 4.2,
    "used_memory": 3.8,
    "memory_usage": 47.5
  },
  "disk": {
    "total_disk": 40.0,
    "used_disk": 12.0,
    "free_disk": 28.0,
    "disk_usage": 30.0
  },
  "system": {
    "hostname": "ubuntu",
    "operating_system": "Linux",
    "os_release": "example-release",
    "architecture": "x86_64",
    "processor": "example-processor",
    "uptime_hours": 2.5
  }
}
```

**Important:** The values above are illustrative examples, not fixed
values. Actual values depend on the monitored machine.

------------------------------------------------------------------------

## 11. System Health Alert Thresholds

The frontend checks CPU, memory, and disk usage values received from the
API.

  Usage              Alert level   Dashboard message
  ------------------ ------------- -----------------------------------
  Below 80%          Normal        All systems are running normally.
  80% to below 90%   Warning       High resource usage warning
  90% or higher      Critical      Critical resource usage

Examples:

-   CPU usage at 85% produces a warning.
-   Memory usage at 95% produces a critical alert.
-   Disk usage at 40% produces no alert.

These thresholds are currently defined in the `updateSystemAlerts()`
function in `app/static/js/dashboard.js`.

------------------------------------------------------------------------

## 12. Commands Used During Development

This section collects the main terminal commands used to build, inspect,
run, and maintain the project.

### Linux navigation and file commands

  Command                     Purpose
  --------------------------- ----------------------------------------
  `pwd`                       Displays the current working directory
  `ls`                        Lists files and directories
  `ls -l`                     Lists files with details
  `cd directory_name`         Changes the current directory
  `mkdir directory_name`      Creates a directory
  `mkdir -p path/to/folder`   Creates nested directories
  `touch file_name`           Creates an empty file
  `cat file_name`             Prints a file's contents
  `nano file_name`            Opens a file in the Nano editor
  `clear`                     Clears the terminal screen

### Python and pip commands

``` bash
python3 --version
pip3 --version
python3 -m venv venv
source venv/bin/activate
pip install psutil flask flask-socketio pytest
pip list
pip freeze > requirements.txt
python run.py
```

### Testing commands

``` bash
pytest
pytest -v
```

### Project inspection commands

``` bash
pwd
ls -la
ls -l app/static/js/
cat requirements.txt
cat .gitignore
```

### Useful application check

With the Flask server running, open another terminal and run:

``` bash
curl http://127.0.0.1:5000/api/system
```

This helps verify whether the backend API is returning system data.

------------------------------------------------------------------------

## 13. Troubleshooting and Fixes

This section documents common issues encountered during setup and
development, along with their fixes.

### Issue 1 -- `pip3: command not found`

**Error:**

``` text
Command 'pip3' not found
```

**Cause:**

The pip package was not installed in Ubuntu.

**Fix:**

``` bash
sudo apt update
sudo apt install python3-pip -y
```

Verify:

``` bash
pip3 --version
```

### Issue 2 -- `ensurepip is not available`

**Error:**

When creating a virtual environment, Python reports that `ensurepip` is
not available.

**Cause:**

The Python virtual environment support package is missing.

**Fix for the Python 3.14 environment used during development:**

``` bash
sudo apt update
sudo apt install python3.14-venv -y
```

Then create the virtual environment again:

``` bash
python3 -m venv venv
source venv/bin/activate
```

If a partially created `venv/` directory prevents creation, remove only
that virtual environment directory and recreate it:

``` bash
rm -rf venv
python3 -m venv venv
source venv/bin/activate
```

**Warning:** `rm -rf venv` permanently deletes the selected `venv`
directory. Check `pwd` and the directory name before running it. Do not
use this command on the project root.

### Issue 3 -- `python: command not found`

**Error:**

``` text
Command 'python' not found
```

**Cause:**

The virtual environment was not activated, or the system provides Python
under the `python3` command.

**Fix:**

``` bash
cd ~/linux-system-health-dashboard
source venv/bin/activate
python run.py
```

Alternatively, use the system command `python3` when appropriate. When
the virtual environment is active, `python` should point to its Python
interpreter.

### Issue 4 -- `git: command not found`

**Error:**

``` text
Command 'git' not found
```

**Cause:**

Git was not installed.

**Fix:**

``` bash
sudo apt update
sudo apt install git -y
```

Verify:

``` bash
git --version
```

### Issue 5 -- Git reports `Author identity unknown`

**Error:**

``` text
Author identity unknown

*** Please tell me who you are.
```

**Cause:**

Git does not have a commit author name and email configured.

**Fix:**

Set your own Git identity. Replace the example values with the name and
email you want associated with your commits:

``` bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Check the configuration:

``` bash
git config --global --list
```

Then retry the commit:

``` bash
git commit -m "Your commit message"
```

### Issue 6 -- `fatal: not a git repository`

**Error:**

``` text
fatal: not a git repository
```

**Cause:**

The command was run outside the project repository, or the repository
has not been initialized.

**Fix:**

First navigate to the project directory:

``` bash
cd ~/linux-system-health-dashboard
```

Check whether Git is initialized:

``` bash
git status
```

If this is a new local repository and no existing Git history needs to
be preserved, initialize it:

``` bash
git init
```

**Important:** Do not run `git init` or repository-recovery commands
blindly in an existing repository. Check the current Git state first.

### Issue 7 -- Git reports a corrupted object or bad HEAD

**Errors previously encountered:**

``` text
error: object file ... is empty
fatal: bad object HEAD
```

**Cause:**

The local `.git` object database was corrupted.

**Recovery performed for this project:**

A backup of the project files was created without the corrupted `.git`
directory or generated environment files:

``` bash
tar --exclude='./.git' \
    --exclude='./venv' \
    --exclude='./__pycache__' \
    --exclude='./.pytest_cache' \
    -czf ../linux-dashboard-backup.tar.gz .
```

The corrupted Git metadata directory was preserved under a different
name:

``` bash
mv .git .git_corrupted_backup
```

A fresh Git repository was initialized:

``` bash
git init
```

The existing GitHub remote was added, then the remote history was
fetched:

``` bash
git remote add origin https://github.com/Chirath0627/Linux_Health_dashboard.git
git fetch origin
```

The local Git index was reset to the remote `main` branch while
retaining the working files:

``` bash
git reset --mixed origin/main
git branch -M main
```

The backup directory was added to `.gitignore` so it would not be
committed:

``` gitignore
.git_corrupted_backup/
```

The recovered repository was then checked, committed, and pushed.

**Critical warning:** This was a recovery procedure for a specific
corrupted repository that already had a GitHub remote and a `main`
branch. Do not repeat these commands as normal setup steps. In
particular, `git reset` changes the local Git index/history state.
Always make a backup and inspect the remote and local repository before
attempting recovery.

### Issue 8 -- Dashboard page does not load

Check that the virtual environment is active and start the application
from the project root:

``` bash
cd ~/linux-system-health-dashboard
source venv/bin/activate
python run.py
```

Check the terminal for Python or Flask error messages.

Confirm that the browser is using:

``` text
http://127.0.0.1:5000
```

### Issue 9 -- API does not return system information

With the Flask server running, test the API:

``` bash
curl http://127.0.0.1:5000/api/system
```

If the request fails:

1.  Check whether Flask is still running.

2.  Check the terminal for traceback/error messages.

3.  Confirm that `psutil` is installed in the active virtual
    environment:

    ``` bash
    pip show psutil
    ```

4.  If it is missing, install the project dependencies:

    ``` bash
    pip install -r requirements.txt
    ```

### Issue 10 -- Browser shows old CSS or JavaScript

**Possible cause:**

The browser may be using cached static files.

**Fix:**

Perform a hard refresh:

``` text
Ctrl + Shift + R
```

Also check that the edited file was saved and that the browser console
does not show JavaScript errors.

### Issue 11 -- Temporary test alerts keep appearing or disappear

**Cause:**

Temporary hard-coded test data may still be present, or real API data
may overwrite the test result.

**Correct live implementation:**

Inside `fetchSystemInfo()`, after parsing the API response, keep:

``` javascript
const data = await response.json();
updateSystemAlerts(data);
```

Remove temporary test calls such as:

``` javascript
updateSystemAlerts({
    cpu: { cpu_usage: 85 },
    memory: { memory_usage: 95 },
    disk: { disk_usage: 40 }
});
```

The temporary test call should not remain in the live application. The
real API values should determine which alerts are displayed.

### Issue 12 -- Source Control changes do not appear in the editor

Check whether Git detects the changes:

``` bash
git status
```

If the file was edited but the editor does not show it in Source
Control:

1.  Save the file.
2.  Refresh the Source Control view.
3.  Close and reopen the file or editor tab if necessary.
4.  Run `git status` again from the project root.

Do not reinitialize or reset the repository just because the editor's
Source Control panel has not refreshed.

------------------------------------------------------------------------

## 14. Git and GitHub Workflow

The project repository:

[Linux Health Dashboard --
GitHub](https://github.com/Chirath0627/Linux_Health_dashboard)

### Check repository status

``` bash
git status
```

### Stage changes

Stage all changed and untracked files:

``` bash
git add .
```

Or stage a specific file:

``` bash
git add README.md
```

### Commit changes

``` bash
git commit -m "Add system health alerts"
```

Use a commit message that describes the changes being saved.

### Push changes to GitHub

``` bash
git push origin main
```

For the initial upstream setup, use:

``` bash
git push -u origin main
```

### Pull the latest remote changes

``` bash
git pull origin main
```

### Check the configured remote

``` bash
git remote -v
```

### Typical workflow after making a change

``` bash
cd ~/linux-system-health-dashboard
source venv/bin/activate

git status
git add .
git commit -m "Describe your changes"
git push origin main
```

Only commit files that should be part of the project. Do not commit the
`venv/`, Python cache directories, or local secrets.

------------------------------------------------------------------------

## 15. Current Status and Future Improvements

### Implemented

-   [x] Ubuntu development environment
-   [x] Python virtual environment
-   [x] Flask application
-   [x] CPU information collector
-   [x] Memory information collector
-   [x] Disk information collector
-   [x] General system information collector
-   [x] JSON API endpoint
-   [x] Dashboard HTML structure
-   [x] Dark dashboard styling
-   [x] Circular CPU, memory, and disk indicators
-   [x] CPU usage history chart
-   [x] Memory usage history chart
-   [x] Automatic two-second data refresh
-   [x] System health warning and critical alerts
-   [x] Basic API tests
-   [x] Git and GitHub repository setup

### Potential future improvements

-   Process monitoring (process name, PID, CPU usage, and memory usage)
-   Network upload and download monitoring
-   More detailed disk and filesystem monitoring
-   Configurable alert thresholds
-   Alert history and timestamps
-   Improved error handling and logging
-   Additional automated tests
-   Deployment configuration for running outside the development
    environment

------------------------------------------------------------------------

## Author / Repository

**Project:** Linux System Health Dashboard\
**Repository:** <https://github.com/Chirath0627/Linux_Health_dashboard>

Built as a hands-on Linux, Python, Flask, and system-monitoring project.
