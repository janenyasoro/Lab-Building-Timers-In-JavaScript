// --- Countdown Logic ---
const countdownDisplay = document.getElementById('countdownDisplay');
const startCountdownBtn = document.getElementById('startCountdown');

startCountdownBtn.addEventListener('click', () => {
    let seconds = parseInt(document.getElementById('countdownInput').value);
    countdownDisplay.textContent = seconds;
    
    startCountdownBtn.disabled = true;
    
    const timerId = setInterval(() => {
        seconds--;
        if (seconds >= 0) {
            countdownDisplay.textContent = seconds;
        } else {
            clearInterval(timerId);
            startCountdownBtn.disabled = false;
        }
    }, 1000);
});

// --- Reminder Logic ---
const setReminderBtn = document.getElementById('setReminder');
const reminderDisplay = document.getElementById('reminderDisplay');

setReminderBtn.addEventListener('click', () => {
    const msg = document.getElementById('reminderMsg').value || "Reminder!";
    const delay = parseInt(document.getElementById('reminderDelay').value);
    
    reminderDisplay.textContent = "Timer set...";
    reminderDisplay.style.color = "#86868b";
    
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(msg);
        }, delay);
    }).then((message) => {
        reminderDisplay.textContent = message;
        reminderDisplay.style.color = "#0071e3";
    });
});

// --- Recurring Logic ---
const startRecurringBtn = document.getElementById('startRecurring');
const stopRecurringBtn = document.getElementById('stopRecurring');
const recurringLogs = document.getElementById('recurringLogs');
let recurringId = null;

startRecurringBtn.addEventListener('click', () => {
    if (recurringId) return;
    
    const msg = document.getElementById('recurringMsg').value;
    const interval = parseInt(document.getElementById('recurringInterval').value);
    
    recurringLogs.innerHTML += `<div>Started: ${msg}</div>`;
    
    recurringId = setInterval(() => {
        const time = new Date().toLocaleTimeString();
        recurringLogs.innerHTML += `<div>[${time}] ${msg}</div>`;
        recurringLogs.scrollTop = recurringLogs.scrollHeight;
    }, interval);
    
    startRecurringBtn.disabled = true;
    stopRecurringBtn.disabled = false;
});

stopRecurringBtn.addEventListener('click', () => {
    if (recurringId) {
        clearInterval(recurringId);
        recurringId = null;
        recurringLogs.innerHTML += `<div>Stopped.</div>`;
        startRecurringBtn.disabled = false;
        stopRecurringBtn.disabled = true;
    }
});

// ... (Keep your existing Countdown, Reminder, and Recurring logic here) ...

// --- Stopwatch (Microsecond precision visual) ---
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startStopwatchBtn = document.getElementById('startStopwatch');
const resetStopwatchBtn = document.getElementById('resetStopwatch');

let stopwatchId = null;
let startTime = 0;
let elapsedTime = 0;

function formatTime(ms) {
    // Calculate parts
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10); // 1/100th of a second

    // Pad with zeros (e.g., "05")
    const minStr = minutes.toString().padStart(2, '0');
    const secStr = seconds.toString().padStart(2, '0');
    const csStr = centiseconds.toString().padStart(2, '0');

    return `${minStr}:${secStr}.${csStr}`;
}

startStopwatchBtn.addEventListener('click', () => {
    if (stopwatchId) {
        // STOP Logic
        clearInterval(stopwatchId);
        stopwatchId = null;
        elapsedTime += performance.now() - startTime;
        startStopwatchBtn.textContent = "Start";
        startStopwatchBtn.classList.remove('destructive');
        startStopwatchBtn.classList.add('primary');
    } else {
        // START Logic
        startTime = performance.now();
        startStopwatchBtn.textContent = "Stop";
        startStopwatchBtn.classList.remove('primary');
        startStopwatchBtn.classList.add('destructive');

        // Update UI every 10ms (approx 100fps)
        stopwatchId = setInterval(() => {
            const currentSessionTime = performance.now() - startTime;
            const totalTime = elapsedTime + currentSessionTime;
            stopwatchDisplay.textContent = formatTime(totalTime);
        }, 10);
    }
});

resetStopwatchBtn.addEventListener('click', () => {
    if (stopwatchId) {
        clearInterval(stopwatchId);
        stopwatchId = null;
        startStopwatchBtn.textContent = "Start";
        startStopwatchBtn.classList.remove('destructive');
        startStopwatchBtn.classList.add('primary');
    }
    elapsedTime = 0;
    stopwatchDisplay.textContent = "00:00.00";
});

// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement; // Target <html> tag for data-theme

// 1. Check for saved preference on load
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = '☀️ Light Mode';
}

// 2. Toggle Event Listener
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        // Switch to Light
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙 Dark Mode';
    } else {
        // Switch to Dark
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }
});
