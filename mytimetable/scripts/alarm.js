// ==================== STATE MANAGEMENT ====================
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let currentDay = '';
let alarmAudio = new Audio();
let lastAlarmTriggered = ""; // Prevent multiple triggers in same minute

// Load Data from localStorage
let schedule = JSON.parse(localStorage.getItem('mySchedule')) || {
    Monday: [
        { id: 1, time: "6:00am", task: "Cook", tag: "Foundation", alarm: true },
        { id: 2, time: "8:00am", task: "Clean", tag: "Foundation", alarm: true },
        { id: 3, time: "10:00am", task: "Read", tag: "Growth", alarm: true },
        { id: 4, time: "12:00pm", task: "Cook Dinner", tag: "Productivity", alarm: true },
        { id: 5, time: "1:00pm", task: "Run Errands", tag: "Productivity", alarm: true },
        { id: 6, time: "4:00pm", task: "Family Home Evening", tag: "Personal", alarm: true }
    ],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {
    sound: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
    volume: 50
};

// ==================== STORAGE FUNCTIONS ====================
function saveData() {
    localStorage.setItem('mySchedule', JSON.stringify(schedule));
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

// ==================== SETTINGS FUNCTIONS ====================
function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function updateSettings() {
    userSettings.sound = document.getElementById('setting-sound').value;
    userSettings.volume = document.getElementById('setting-volume').value;
    document.getElementById('vol-label').innerText = userSettings.volume;
    saveData();
}

function previewSound() {
    alarmAudio.src = userSettings.sound;
    alarmAudio.volume = userSettings.volume / 100;
    alarmAudio.play();
    setTimeout(() => alarmAudio.pause(), 3000); // Stop after 3 seconds for preview
}

function stopAlarm() {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    document.getElementById('alarm-notification').style.display = 'none';
    alarmAudio.loop = false;
}

// ==================== DAY NAVIGATION ====================
function syncWithCurrentDay() {
    const todayName = DAYS[new Date().getDay()];
    const btn = document.querySelector(`[data-day="${todayName}"]`);
    switchDay(todayName, btn);
}

function switchDay(day, btn) {
    currentDay = day;
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderSchedule();
}

// ==================== TIME UTILITIES ====================
function parseTo24(timeStr) {
    try {
        const cleaned = timeStr.toLowerCase().trim();
        let time = cleaned.match(/[0-9:]+/)[0];
        let modifier = cleaned.match(/[am|pm]+/)?.[0];
        let [hours, minutes] = time.split(':');
        if (minutes === undefined) minutes = "00";
        hours = parseInt(hours, 10);
        
        if (modifier === 'am') {
            hours = hours === 12 ? 0 : hours;
        } else if (modifier === 'pm') {
            hours = hours === 12 ? 12 : hours + 12;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (e) {
        console.error('Time parsing error:', e);
        return "00:00";
    }
}

// ==================== ALARM FUNCTIONS ====================
function checkAlarms() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDayName = DAYS[now.getDay()];

    // Unique key for this minute and day to prevent re-triggering
    const alarmKey = `${currentDayName}-${currentTime}`;
    if (lastAlarmTriggered === alarmKey) return;

    const todaysTasks = schedule[currentDayName] || [];
    todaysTasks.forEach(task => {
        if (task.alarm) {
            try {
                if (parseTo24(task.time) === currentTime) {
                    triggerAlarm(task.task);
                    lastAlarmTriggered = alarmKey;
                }
            } catch(e) { 
                // Silent on invalid time formats
            }
        }
    });
}

function triggerAlarm(taskName) {
    document.getElementById('alert-task').innerText = taskName;
    document.getElementById('alarm-notification').style.display = 'block';
    alarmAudio.src = userSettings.sound;
    alarmAudio.volume = userSettings.volume / 100;
    alarmAudio.loop = true;
    alarmAudio.play().catch(e => console.log("User interaction required for audio"));
}

// ==================== UI RENDERER ====================
function renderSchedule() {
    const body = document.getElementById('schedule-body');
    const tasks = schedule[currentDay] || [];
    body.innerHTML = '';
    
    if (tasks.length === 0) {
        body.innerHTML = `<tr><td colspan="3" style="padding: 40px; text-align: center; color: var(--text-muted); font-style: italic;">No activities for ${currentDay}. Click + Add to create one.</td></tr>`;
        return;
    }

    tasks.sort((a, b) => {
        const timeA = parseTo24(a.time);
        const timeB = parseTo24(b.time);
        return timeA.localeCompare(timeB);
    });

    tasks.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="time-cell">
                <span class="editable" onclick="editField(${item.id}, 'time', this)">${item.time}</span>
            </td>
            <td class="activity-cell">
                <span class="editable" onclick="editField(${item.id}, 'task', this)">${item.task}</span>
                <span class="tag tag-${item.tag.toLowerCase()}" onclick="changeCategory(${item.id})">${item.tag}</span>
            </td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="toggleAlarm(${item.id})">${item.alarm ? '🔔' : '🔕'}</button>
                <button class="btn-icon" onclick="deleteTask(${item.id})">🗑️</button>
            </td>
        `;
        body.appendChild(row);
    });
}

// ==================== TASK OPERATIONS ====================
function editField(id, field, element) {
    const currentVal = element.innerText;
    const input = document.createElement('input');
    input.value = currentVal;
    input.style.width = field === 'time' ? '80px' : '150px';
    
    input.onblur = () => {
        const newVal = input.value || currentVal;
        const task = schedule[currentDay].find(t => t.id === id);
        if (task) task[field] = newVal;
        saveData();
        renderSchedule();
    };
    
    input.onkeydown = (e) => { 
        if(e.key === 'Enter') input.blur(); 
    };
    
    element.innerHTML = '';
    element.appendChild(input);
    input.focus();
}

function changeCategory(id) {
    const task = schedule[currentDay].find(t => t.id === id);
    const categories = ["Foundation", "Growth", "Productivity", "Personal"];
    let nextIndex = (categories.indexOf(task.tag) + 1) % categories.length;
    task.tag = categories[nextIndex];
    saveData();
    renderSchedule();
}

function addNewTask() {
    const timeInput = document.getElementById('task-time');
    const nameInput = document.getElementById('task-name');
    const tagInput = document.getElementById('task-tag');
    
    if (!timeInput.value || !nameInput.value) {
        alert('Please enter both time and activity');
        return;
    }
    
    if (!schedule[currentDay]) {
        schedule[currentDay] = [];
    }
    
    schedule[currentDay].push({ 
        id: Date.now(), 
        time: timeInput.value, 
        task: nameInput.value, 
        tag: tagInput.value, 
        alarm: true 
    });
    
    saveData();
    renderSchedule();
    timeInput.value = ''; 
    nameInput.value = '';
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        schedule[currentDay] = schedule[currentDay].filter(t => t.id !== id);
        saveData();
        renderSchedule();
    }
}

function toggleAlarm(id) {
    const task = schedule[currentDay].find(t => t.id === id);
    if (task) task.alarm = !task.alarm;
    saveData();
    renderSchedule();
}

// ==================== LIVE CLOCK ====================
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('current-time-display').innerText = now.toLocaleString('en-US', options);
    checkAlarms();
}

// ==================== INITIALIZATION ====================
function initializeApp() {
    console.log('🚀 Initializing Smart Schedule...');
    
    // Initialize default data if needed
    if (!schedule.Monday || schedule.Monday.length === 0) {
        schedule = {
            Monday: [
                { id: 1, time: "6:00am", task: "Cook", tag: "Foundation", alarm: true },
                { id: 2, time: "8:00am", task: "Clean", tag: "Foundation", alarm: true },
                { id: 3, time: "10:00am", task: "Read", tag: "Growth", alarm: true },
                { id: 4, time: "12:00pm", task: "Cook Dinner", tag: "Productivity", alarm: true },
                { id: 5, time: "1:00pm", task: "Run Errands", tag: "Productivity", alarm: true },
                { id: 6, time: "4:00pm", task: "Family Home Evening", tag: "Personal", alarm: true }
            ],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };
    }

    // Set UI to saved settings
    document.getElementById('setting-sound').value = userSettings.sound;
    document.getElementById('setting-volume').value = userSettings.volume;
    document.getElementById('vol-label').innerText = userSettings.volume;

    // Set up clock
    setInterval(updateClock, 1000);
    updateClock();
    
    // Start with current day
    syncWithCurrentDay();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    console.log('✅ App initialized');
}

// Start the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    alarmAudio.pause();
    alarmAudio.src = '';
});