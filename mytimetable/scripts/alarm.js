/**
 * Editable Weekly Schedule with Independent Music Alarm
 * Version 1.0.0
 * 
 * Features:
 * - Editable time cells (double-click to edit)
 * - Independent volume control (not linked to device)
 * - Custom music upload for alarms
 * - Automatic alarm triggering based on schedule
 * - Persistent storage using localStorage
 */

// ==================== STATE MANAGEMENT ====================
const AppState = (function() {
    // Private state
    let _currentDay = 'monday';
    let _alarmAudio = null;
    let _userVolume = 0.7; // 70% default
    let _audioBlobUrl = null;
    let _alarmStatus = 'idle'; // idle, ready, playing, error
    let _scheduleData = null;

    // Public methods
    return {
        getCurrentDay: () => _currentDay,
        setCurrentDay: (day) => { _currentDay = day; },
        
        getAlarmAudio: () => _alarmAudio,
        setAlarmAudio: (audio) => { _alarmAudio = audio; },
        
        getUserVolume: () => _userVolume,
        setUserVolume: (volume) => { _userVolume = volume; },
        
        getAudioBlobUrl: () => _audioBlobUrl,
        setAudioBlobUrl: (url) => { _audioBlobUrl = url; },
        
        getAlarmStatus: () => _alarmStatus,
        setAlarmStatus: (status) => { _alarmStatus = status; },
        
        getScheduleData: () => _scheduleData,
        setScheduleData: (data) => { _scheduleData = data; }
    };
})();

// ==================== SCHEDULE DATA MANAGER ====================
const ScheduleManager = (function() {
    // Default schedule data
    const defaultSchedule = {
        monday: [
            { time: "6:00am", activity: "Cook", tag: "Foundation" },
            { time: "8:00am", activity: "Clean", tag: "Foundation" },
            { time: "10:00am", activity: "Read", tag: "Growth" },
            { time: "12:00pm", activity: "Cook Dinner", tag: "Productivity" },
            { time: "1:00pm", activity: "Run Errands", tag: "Productivity" },
            { time: "4:00pm", activity: "Family Home Evening", tag: "Personal" }
        ],
        tuesday: [
            { time: "6:00am", activity: "Cook", tag: "Foundation" },
            { time: "8:00am", activity: "Clean", tag: "Foundation" },
            { time: "10:00am", activity: "Read", tag: "Growth" },
            { time: "12:00pm", activity: "Cook Dinner", tag: "Productivity" },
            { time: "1:00pm", activity: "Run Errands", tag: "Productivity" },
            { time: "4:00pm", activity: "School Studies", tag: "Growth" }
        ],
        wednesday: [
            { time: "6:00am", activity: "Cook", tag: "Foundation" },
            { time: "8:00am", activity: "Clean", tag: "Foundation" },
            { time: "10:00am", activity: "Read", tag: "Growth" },
            { time: "12:00pm", activity: "Cook Dinner", tag: "Productivity" },
            { time: "1:00pm", activity: "Run Errands", tag: "Productivity" },
            { time: "4:00pm", activity: "School Studies", tag: "Growth" }
        ],
        thursday: [
            { time: "6:00am", activity: "Cook", tag: "Foundation" },
            { time: "8:00am", activity: "Clean", tag: "Foundation" },
            { time: "10:00am", activity: "Read", tag: "Growth" },
            { time: "12:00pm", activity: "Cook Dinner", tag: "Productivity" },
            { time: "1:00pm", activity: "Run Errands", tag: "Productivity" },
            { time: "4:00pm", activity: "School Studies", tag: "Growth" }
        ],
        friday: [
            { time: "6:00am", activity: "Cook", tag: "Foundation" },
            { time: "8:00am", activity: "Clean", tag: "Foundation" },
            { time: "10:00am", activity: "Read", tag: "Growth" },
            { time: "12:00pm", activity: "Cook Dinner", tag: "Productivity" },
            { time: "1:00pm", activity: "Run Errands", tag: "Productivity" },
            { time: "4:00pm", activity: "School Studies", tag: "Growth" }
        ],
        saturday: [
            { time: "6:00am", activity: "Cook", tag: "Foundation" },
            { time: "8:00am", activity: "Clean", tag: "Foundation" },
            { time: "10:00am", activity: "Read", tag: "Growth" },
            { time: "12:00pm", activity: "Cook Dinner", tag: "Productivity" },
            { time: "1:00pm", activity: "Run Errands", tag: "Productivity" },
            { time: "3:00pm", activity: "Driving Lesson 🚗", tag: "Growth" },
            { time: "4:00pm", activity: "School Studies", tag: "Growth" },
            { time: "5:00pm", activity: "Evening Walk 🚶", tag: "Personal" }
        ],
        sunday: [
            { time: "8:00am", activity: "Read", tag: "Growth" },
            { time: "10:00am", activity: "Cook", tag: "Foundation" },
            { time: "12:00pm", activity: "Clean (Optional)", tag: "Foundation" },
            { time: "2:00pm", activity: "Visit Younger Ones 👨‍👩‍👧", tag: "Personal" }
        ]
    };

    // Load from localStorage or use defaults
    function loadSchedule() {
        try {
            const saved = localStorage.getItem('weeklySchedule');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to parse saved schedule', e);
        }
        return JSON.parse(JSON.stringify(defaultSchedule)); // Deep copy
    }

    function loadAlarmStates() {
        try {
            const saved = localStorage.getItem('alarmStates');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to parse alarm states', e);
        }
        
        // Create default alarm states (all true)
        const defaultStates = {};
        Object.keys(defaultSchedule).forEach(day => {
            defaultStates[day] = {};
            defaultSchedule[day].forEach((_, index) => {
                defaultStates[day][index] = true;
            });
        });
        return defaultStates;
    }

    function saveSchedule(schedule) {
        try {
            localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
        } catch (e) {
            console.error('Failed to save schedule', e);
        }
    }

    function saveAlarmStates(states) {
        try {
            localStorage.setItem('alarmStates', JSON.stringify(states));
        } catch (e) {
            console.error('Failed to save alarm states', e);
        }
    }

    return {
        loadSchedule,
        loadAlarmStates,
        saveSchedule,
        saveAlarmStates
    };
})();

// ==================== TIME UTILITIES ====================
const TimeUtils = (function() {
    /**
     * Convert 12-hour time string to 24-hour format
     * @param {string} time12h - e.g., "6:00am", "12:00pm"
     * @returns {string} - e.g., "6:0", "12:0"
     */
    function convertTo24Hour(time12h) {
        if (!time12h) return '';
        
        const match = time12h.toLowerCase().match(/^(\d{1,2}):(\d{2})(am|pm)$/);
        if (!match) return '';
        
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const modifier = match[3];
        
        if (modifier === 'pm' && hours !== 12) hours += 12;
        if (modifier === 'am' && hours === 12) hours = 0;
        
        return `${hours}:${minutes}`;
    }

    /**
     * Validate time string format
     * @param {string} timeStr 
     * @returns {boolean}
     */
    function isValidTimeFormat(timeStr) {
        const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/i;
        return regex.test(timeStr);
    }

    /**
     * Get current time as comparable string
     * @returns {Object} - { hours, minutes, day }
     */
    function getCurrentTimeInfo() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        
        return { hours, minutes, day };
    }

    return {
        convertTo24Hour,
        isValidTimeFormat,
        getCurrentTimeInfo
    };
})();

// ==================== ALARM MANAGER ====================
const AlarmManager = (function() {
    let alarmCheckInterval = null;

    /**
     * Initialize alarm checking system
     */
    function initAlarmChecker() {
        // Clear any existing interval
        if (alarmCheckInterval) {
            clearInterval(alarmCheckInterval);
        }
        
        // Check every 30 seconds
        alarmCheckInterval = setInterval(checkScheduledAlarms, 30000);
        
        // Also check immediately
        setTimeout(checkScheduledAlarms, 1000);
    }

    /**
     * Check if any alarms should trigger
     */
    function checkScheduledAlarms() {
        const audio = AppState.getAlarmAudio();
        if (!audio) return; // No audio loaded
        
        const { hours, minutes, day } = TimeUtils.getCurrentTimeInfo();
        const currentTimeStr = `${hours}:${minutes}`;
        
        const schedule = AppState.getScheduleData();
        if (!schedule) return;
        
        const alarmStates = ScheduleManager.loadAlarmStates();
        const daySchedule = schedule[day] || [];
        
        // Check each task for this day
        daySchedule.forEach((task, index) => {
            const taskTime24 = TimeUtils.convertTo24Hour(task.time);
            
            // If time matches and alarm is ON
            if (taskTime24 === currentTimeStr && alarmStates[day]?.[index] === true) {
                triggerAlarm(task);
            }
        });
    }

    /**
     * Trigger the alarm sound
     * @param {Object} task - The task that triggered the alarm
     */
    function triggerAlarm(task) {
        const audio = AppState.getAlarmAudio();
        if (!audio) return;
        
        // Set volume from AppState
        audio.volume = AppState.getUserVolume();
        
        // Play the alarm
        audio.currentTime = 0;
        audio.play()
            .then(() => {
                AppState.setAlarmStatus('playing');
                updateAlarmStatus(`🔔 Alarm: ${task.activity} at ${task.time}`);
                
                // Show browser notification if permitted
                showNotification(task);
                
                // Reset status after alarm finishes
                audio.onended = () => {
                    AppState.setAlarmStatus('ready');
                    updateAlarmStatus('Ready. Music loaded.');
                };
            })
            .catch(error => {
                console.error('Alarm playback failed:', error);
                AppState.setAlarmStatus('error');
                updateAlarmStatus('❌ Playback failed. Click to test.');
            });
    }

    /**
     * Show browser notification
     * @param {Object} task 
     */
    function showNotification(task) {
        if (!('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            new Notification('⏰ Schedule Alarm', {
                body: `Time for: ${task.activity}`,
                icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%231e4a76\'/%3E%3Ctext x=\'25\' y=\'70\' fill=\'white\' font-size=\'50\'%3E⏰%3C/text%3E%3C/svg%3E'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    /**
     * Update alarm status in UI
     * @param {string} message 
     */
    function updateAlarmStatus(message) {
        const statusEl = document.getElementById('alarmStatus');
        if (!statusEl) return;
        
        const statusText = statusEl.querySelector('.status-text');
        const indicator = statusEl.querySelector('.status-indicator');
        
        if (statusText) {
            statusText.textContent = message;
        }
        
        if (indicator) {
            indicator.className = 'status-indicator ' + AppState.getAlarmStatus();
        }
    }

    return {
        initAlarmChecker,
        updateAlarmStatus
    };
})();

// ==================== UI RENDERER ====================
const UIRenderer = (function() {
    /**
     * Render schedule for a specific day
     * @param {string} day 
     */
    function renderSchedule(day) {
        const scheduleBody = document.getElementById('scheduleBody');
        if (!scheduleBody) return;
        
        const schedule = AppState.getScheduleData();
        if (!schedule) return;
        
        const daySchedule = schedule[day] || [];
        const alarmStates = ScheduleManager.loadAlarmStates();
        
        scheduleBody.innerHTML = '';
        
        daySchedule.forEach((item, index) => {
            const row = createScheduleRow(item, index, day, alarmStates);
            scheduleBody.appendChild(row);
        });
        
        // Update current day display
        const currentDayEl = document.getElementById('currentDay');
        if (currentDayEl) {
            currentDayEl.textContent = day.charAt(0).toUpperCase() + day.slice(1);
        }
    }

    /**
     * Create a schedule table row
     */
    function createScheduleRow(item, index, day, alarmStates) {
        const row = document.createElement('tr');
        
        // Time cell (editable)
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.textContent = item.time;
        timeCell.setAttribute('data-day', day);
        timeCell.setAttribute('data-index', index);
        timeCell.addEventListener('dblclick', handleTimeEdit);
        
        // Activity cell
        const activityCell = document.createElement('td');
        activityCell.className = 'activity-cell';
        activityCell.textContent = item.activity;
        
        // Tag cell
        const tagCell = document.createElement('td');
        tagCell.className = 'tag-cell';
        const tagSpan = document.createElement('span');
        tagSpan.className = `category-tag ${item.tag.toLowerCase()}`;
        tagSpan.textContent = item.tag;
        tagCell.appendChild(tagSpan);
        
        // Alarm cell
        const alarmCell = document.createElement('td');
        alarmCell.className = 'alarm-cell';
        const alarmBtn = document.createElement('button');
        const isOn = alarmStates[day]?.[index] !== false;
        alarmBtn.className = `alarm-toggle ${isOn ? 'on' : 'off'}`;
        alarmBtn.innerHTML = isOn ? '🔔 ON' : '🔕 OFF';
        alarmBtn.setAttribute('data-day', day);
        alarmBtn.setAttribute('data-index', index);
        alarmBtn.addEventListener('click', toggleAlarm);
        alarmCell.appendChild(alarmBtn);
        
        row.appendChild(timeCell);
        row.appendChild(activityCell);
        row.appendChild(tagCell);
        row.appendChild(alarmCell);
        
        return row;
    }

    /**
     * Handle double-click time editing
     */
    function handleTimeEdit(event) {
        const cell = event.currentTarget;
        const currentTime = cell.textContent;
        const day = cell.getAttribute('data-day');
        const index = cell.getAttribute('data-index');
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTime;
        input.className = 'time-input-editor';
        input.placeholder = '6:00am';
        
        // Clear cell and append input
        cell.textContent = '';
        cell.appendChild(input);
        input.focus();
        
        // Handle input events
        input.addEventListener('blur', () => finalizeTimeEdit(input, cell, day, index));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finalizeTimeEdit(input, cell, day, index);
            }
        });
    }

    /**
     * Finalize time edit and save
     */
    function finalizeTimeEdit(input, cell, day, index) {
        const newTime = input.value.trim().toLowerCase();
        
        // Validate time format
        if (TimeUtils.isValidTimeFormat(newTime)) {
            cell.textContent = newTime;
            
            // Update schedule data
            const schedule = AppState.getScheduleData();
            if (schedule && schedule[day] && schedule[day][index]) {
                schedule[day][index].time = newTime;
                ScheduleManager.saveSchedule(schedule);
                showToast('Time updated successfully', 'success');
            }
        } else {
            // Revert to original
            const schedule = AppState.getScheduleData();
            cell.textContent = schedule[day][index].time;
            
            // Show error toast
            showToast('Invalid time format. Use e.g., 6:00am', 'error');
        }
    }

    /**
     * Toggle alarm state
     */
    function toggleAlarm(event) {
        const btn = event.currentTarget;
        const day = btn.getAttribute('data-day');
        const index = btn.getAttribute('data-index');
        
        const isCurrentlyOn = btn.classList.contains('on');
        const newState = !isCurrentlyOn;
        
        // Update button UI
        btn.className = `alarm-toggle ${newState ? 'on' : 'off'}`;
        btn.innerHTML = newState ? '🔔 ON' : '🔕 OFF';
        
        // Update alarm states in storage
        const alarmStates = ScheduleManager.loadAlarmStates();
        if (!alarmStates[day]) alarmStates[day] = {};
        alarmStates[day][index] = newState;
        ScheduleManager.saveAlarmStates(alarmStates);
        
        // Show feedback
        showToast(`Alarm ${newState ? 'ON' : 'OFF'} for this task`, 'success');
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (toast.parentNode) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }

    return {
        renderSchedule,
        showToast
    };
})();

// ==================== EVENT HANDLERS ====================

// Week selector click handler
function handleDaySelection(event) {
    const btn = event.currentTarget;
    const day = btn.getAttribute('data-day');
    
    // Update active state
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Store current day
    AppState.setCurrentDay(day);
    
    // Render schedule
    UIRenderer.renderSchedule(day);
}

// File upload handler
function handleFileUpload(event) {
    const file = event.target.files[0];
    const fileNameSpan = document.getElementById('fileName');
    
    if (!file) {
        fileNameSpan.textContent = 'No file chosen';
        return;
    }
    
    fileNameSpan.textContent = file.name;
    
    // Clean up previous blob URL
    const oldUrl = AppState.getAudioBlobUrl();
    if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
    }
    
    const oldAudio = AppState.getAlarmAudio();
    if (oldAudio) {
        oldAudio.pause();
    }
    
    // Create new audio
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.volume = AppState.getUserVolume();
    audio.load();
    
    AppState.setAlarmAudio(audio);
    AppState.setAudioBlobUrl(url);
    AppState.setAlarmStatus('ready');
    
    AlarmManager.updateAlarmStatus('✅ Music loaded. Ready for alarms.');
}

// Volume slider handler
function handleVolumeChange(event) {
    const value = parseInt(event.target.value, 10) / 100;
    AppState.setUserVolume(value);
    
    // Update display
    const volumeSpan = document.getElementById('volumeValue');
    if (volumeSpan) {
        volumeSpan.textContent = Math.round(value * 100) + '%';
    }
    
    // Update audio volume if exists
    const audio = AppState.getAlarmAudio();
    if (audio) {
        audio.volume = value;
    }
}

// Test alarm handler
function handleTestAlarm() {
    const audio = AppState.getAlarmAudio();
    
    if (!audio) {
        UIRenderer.showToast('⚠️ Please upload an audio file first.', 'error');
        return;
    }
    
    audio.volume = AppState.getUserVolume();
    audio.currentTime = 0;
    audio.play()
        .then(() => {
            AppState.setAlarmStatus('playing');
            AlarmManager.updateAlarmStatus('🔊 Testing alarm...');
            
            audio.onended = () => {
                AppState.setAlarmStatus('ready');
                AlarmManager.updateAlarmStatus('✅ Test complete. Ready.');
            };
        })
        .catch(error => {
            console.error('Test playback failed:', error);
            AppState.setAlarmStatus('error');
            AlarmManager.updateAlarmStatus('❌ Playback failed. Try another file.');
        });
}

// ==================== LIVE CLOCK ====================
function updateLiveClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
}

// ==================== INITIALIZATION ====================
function initializeApp() {
    console.log('🚀 Initializing Editable Weekly Schedule...');
    
    // Load schedule data
    const schedule = ScheduleManager.loadSchedule();
    AppState.setScheduleData(schedule);
    
    // Set up live clock
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    
    // Render default day (Monday)
    UIRenderer.renderSchedule('monday');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize alarm checker
    AlarmManager.initAlarmChecker();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Load saved volume from localStorage if exists
    try {
        const savedVolume = localStorage.getItem('userVolume');
        if (savedVolume) {
            const vol = parseFloat(savedVolume);
            AppState.setUserVolume(vol);
            const slider = document.getElementById('volumeSlider');
            const valueDisplay = document.getElementById('volumeValue');
            if (slider) slider.value = vol * 100;
            if (valueDisplay) valueDisplay.textContent = Math.round(vol * 100) + '%';
        }
    } catch (e) {
        console.error('Failed to load saved volume', e);
    }
    
    console.log('✅ App initialized successfully');
}

function setupEventListeners() {
    // Week selector buttons
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', handleDaySelection);
    });
    
    // File upload
    const fileInput = document.getElementById('alarmMusicFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Volume slider
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', handleVolumeChange);
        volumeSlider.addEventListener('change', () => {
            localStorage.setItem('userVolume', AppState.getUserVolume());
        });
    }
    
    // Test button
    const testBtn = document.getElementById('testAlarmBtn');
    if (testBtn) {
        testBtn.addEventListener('click', handleTestAlarm);
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    const oldUrl = AppState.getAudioBlobUrl();
    if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
    }
});


// Add this function to your script.js
const AudioStorage = (function() {
    const DB_NAME = 'AlarmAudioDB';
    const STORE_NAME = 'audioFiles';
    const DB_VERSION = 1;

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    async function saveAudioFile(file, fileName) {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                
                // Store both file and metadata
                const audioData = {
                    file: file,
                    fileName: fileName,
                    timestamp: new Date().getTime()
                };
                
                const request = store.put(audioData, 'currentAlarm');
                
                request.onsuccess = () => {
                    console.log('Audio file saved to IndexedDB');
                    resolve(true);
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to save audio file:', error);
            return false;
        }
    }

    async function loadAudioFile() {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get('currentAlarm');
                
                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to load audio file:', error);
            return null;
        }
    }

    return {
        saveAudioFile,
        loadAudioFile
    };
})();

// Modify your handleFileUpload function:
async function handleFileUpload(event) {
    const file = event.target.files[0];
    const fileNameSpan = document.getElementById('fileName');
    
    if (!file) {
        fileNameSpan.textContent = 'No file chosen';
        return;
    }
    
    fileNameSpan.textContent = file.name;
    
    // Clean up previous blob URL
    const oldUrl = AppState.getAudioBlobUrl();
    if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
    }
    
    const oldAudio = AppState.getAlarmAudio();
    if (oldAudio) {
        oldAudio.pause();
    }
    
    // Save to IndexedDB
    await AudioStorage.saveAudioFile(file, file.name);
    
    // Create new audio
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.volume = AppState.getUserVolume();
    audio.load();
    
    AppState.setAlarmAudio(audio);
    AppState.setAudioBlobUrl(url);
    AppState.setAlarmStatus('ready');
    
    AlarmManager.updateAlarmStatus('✅ Music loaded. Ready for alarms.');
}

// Add this to your initializeApp function to load saved audio on startup:
async function loadSavedAudio() {
    const savedAudio = await AudioStorage.loadAudioFile();
    if (savedAudio && savedAudio.file) {
        const file = savedAudio.file;
        const fileNameSpan = document.getElementById('fileName');
        fileNameSpan.textContent = savedAudio.fileName || 'Audio file';
        
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        audio.volume = AppState.getUserVolume();
        audio.load();
        
        AppState.setAlarmAudio(audio);
        AppState.setAudioBlobUrl(url);
        AppState.setAlarmStatus('ready');
        
        AlarmManager.updateAlarmStatus('✅ Previous music loaded.');
    }
}

// Add this line to initializeApp after setting up event listeners:
loadSavedAudio();