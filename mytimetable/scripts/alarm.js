/**
 * POWER SCHEDULE & ALARMS
 * Professional Schedule Manager with Wake Lock Support
 * Version 2.0.0
 */

// ==================== CONSTANTS & CONFIGURATION ====================
const CONFIG = {
    DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    STORAGE_KEYS: {
        SCHEDULE: 'power_schedule_v2',
        SETTINGS: 'power_settings_v2'
    },
    AUDIO: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        DEFAULT_SOUND: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
        FALLBACK_SOUND: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
    },
    VIBRATION_PATTERN: [500, 200, 500, 200, 500],
    ALARM_CHECK_INTERVAL: 1000,
    NOTIFICATION_TIMEOUT: 3000
};

// ==================== STATE MANAGEMENT ====================
const AppState = (function() {
    let _currentDay = CONFIG.DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    let _alarmAudio = new Audio();
    let _wakeLock = null;
    let _audioContext = null;
    let _audioSource = null;
    let _isAudioInitialized = false;
    let _lastAlarmTriggered = '';
    let _alarmTimeouts = new Set();

    return {
        getCurrentDay: () => _currentDay,
        setCurrentDay: (day) => { _currentDay = day; },
        
        getAlarmAudio: () => _alarmAudio,
        setAlarmAudio: (audio) => { _alarmAudio = audio; },
        
        getWakeLock: () => _wakeLock,
        setWakeLock: (lock) => { _wakeLock = lock; },
        
        getAudioContext: () => _audioContext,
        setAudioContext: (ctx) => { _audioContext = ctx; },
        
        getAudioSource: () => _audioSource,
        setAudioSource: (source) => { _audioSource = source; },
        
        isAudioInitialized: () => _isAudioInitialized,
        setAudioInitialized: (value) => { _isAudioInitialized = value; },
        
        getLastAlarmTriggered: () => _lastAlarmTriggered,
        setLastAlarmTriggered: (key) => { _lastAlarmTriggered = key; },
        
        getAlarmTimeouts: () => _alarmTimeouts,
        addAlarmTimeout: (timeout) => { _alarmTimeouts.add(timeout); },
        clearAlarmTimeouts: () => {
            _alarmTimeouts.forEach(timeout => clearTimeout(timeout));
            _alarmTimeouts.clear();
        }
    };
})();

// ==================== DATA MANAGER ====================
const DataManager = (function() {
    const defaultSchedule = {};
    CONFIG.DAYS.forEach(day => { defaultSchedule[day] = []; });

    const defaultSettings = {
        theme: 'system',
        sound: CONFIG.AUDIO.DEFAULT_SOUND,
        customSound: null,
        volume: 50,
        notifications: true,
        vibration: true
    };

    // Initialize default Monday tasks
    defaultSchedule.Monday = [
        { id: Date.now() - 6, time: "08:00", text: "Cook", tag: "Foundation", alarm: true, done: false }
    ];

    function loadSchedule() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SCHEDULE);
            if (!saved) return JSON.parse(JSON.stringify(defaultSchedule));

            const parsed = JSON.parse(saved);
            
            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error('Invalid schedule format');
            }

            CONFIG.DAYS.forEach(day => {
                if (!Array.isArray(parsed[day])) {
                    parsed[day] = [];
                }
            });

            return parsed;
        } catch (e) {
            console.error('Failed to load schedule:', e);
            return JSON.parse(JSON.stringify(defaultSchedule));
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
            if (!saved) return { ...defaultSettings };

            const parsed = JSON.parse(saved);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            console.error('Failed to load settings:', e);
            return { ...defaultSettings };
        }
    }

    function saveSchedule(schedule) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
            return true;
        } catch (e) {
            console.error('Failed to save schedule:', e);
            return false;
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    return {
        loadSchedule,
        loadSettings,
        saveSchedule,
        saveSettings,
        defaultSettings
    };
})();

// ==================== AUDIO MANAGER ====================
const AudioManager = (function() {
    let activeSources = new Set();

    async function initAudioContext() {
        if (AppState.isAudioInitialized()) return true;

        try {
            if (!window.AudioContext && !window.webkitAudioContext) {
                console.warn('AudioContext not supported');
                return false;
            }

            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const context = new AudioContextClass();
            AppState.setAudioContext(context);

            document.addEventListener('click', async () => {
                if (context.state === 'suspended') {
                    try {
                        await context.resume();
                    } catch (e) {
                        console.warn('Failed to resume audio context:', e);
                    }
                }
            }, { once: true });

            AppState.setAudioInitialized(true);
            return true;
        } catch (e) {
            console.error('AudioContext initialization failed:', e);
            return false;
        }
    }

    async function playSound(soundUrl, volume = 50, loop = false) {
        try {
            const webAudioSuccess = await playWithWebAudio(soundUrl, volume, loop);
            if (webAudioSuccess) return true;
            return playWithAudioElement(soundUrl, volume, loop);
        } catch (e) {
            console.error('All audio playback methods failed:', e);
            return false;
        }
    }

    async function playWithWebAudio(soundUrl, volume, loop) {
        const context = AppState.getAudioContext();
        if (!context) return false;

        try {
            if (context.state === 'suspended') {
                await context.resume();
            }

            const currentSource = AppState.getAudioSource();
            if (currentSource) {
                try {
                    currentSource.stop();
                } catch (e) {}
            }

            let arrayBuffer;
            if (soundUrl.startsWith('data:')) {
                const response = await fetch(soundUrl);
                if (!response.ok) throw new Error('Failed to fetch data URL');
                arrayBuffer = await response.arrayBuffer();
            } else {
                const response = await fetch(soundUrl, { mode: 'cors', cache: 'force-cache' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                arrayBuffer = await response.arrayBuffer();
            }

            const audioBuffer = await context.decodeAudioData(arrayBuffer);

            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = loop;

            const gainNode = context.createGain();
            gainNode.gain.value = Math.max(0, Math.min(1, volume / 100));

            source.connect(gainNode);
            gainNode.connect(context.destination);

            source.start(0);
            AppState.setAudioSource(source);
            
            activeSources.add(source);
            source.onended = () => {
                activeSources.delete(source);
                if (AppState.getAudioSource() === source) {
                    AppState.setAudioSource(null);
                }
            };

            return true;
        } catch (e) {
            console.warn('Web Audio playback failed:', e);
            return false;
        }
    }

    function playWithAudioElement(soundUrl, volume, loop) {
        return new Promise((resolve) => {
            try {
                const audio = AppState.getAlarmAudio();
                audio.src = soundUrl;
                audio.volume = Math.max(0, Math.min(1, volume / 100));
                audio.loop = loop;
                
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => resolve(true))
                               .catch(e => {
                                   console.warn('Audio element playback failed:', e);
                                   resolve(false);
                               });
                } else {
                    resolve(true);
                }
            } catch (e) {
                console.warn('Audio element error:', e);
                resolve(false);
            }
        });
    }

    function stopAll() {
        activeSources.forEach(source => {
            try {
                source.stop();
            } catch (e) {}
        });
        activeSources.clear();
        AppState.setAudioSource(null);

        const audio = AppState.getAlarmAudio();
        audio.pause();
        audio.currentTime = 0;
        audio.loop = false;
    }

    function preview(soundUrl, volume) {
        stopAll();
        return playSound(soundUrl, volume, false);
    }

    return {
        init: initAudioContext,
        play: playSound,
        stopAll,
        preview
    };
})();

// ==================== WAKE LOCK MANAGER ====================
const WakeLockManager = (function() {
    let wakeLock = null;
    let isSupported = 'wakeLock' in navigator;

    async function request() {
        if (!isSupported) {
            console.log('Wake Lock API not supported');
            return false;
        }

        try {
            if (wakeLock) {
                await release();
            }

            wakeLock = await navigator.wakeLock.request('screen');
            
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
                wakeLock = null;
            });

            console.log('Wake Lock acquired');
            return true;
        } catch (e) {
            console.error('Wake Lock error:', e);
            return false;
        }
    }

    async function release() {
        if (wakeLock) {
            try {
                await wakeLock.release();
            } catch (e) {
                console.warn('Wake Lock release error:', e);
            }
            wakeLock = null;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            request();
        }
    });

    return {
        request,
        release,
        isSupported
    };
})();

// ==================== NOTIFICATION MANAGER ====================
const NotificationManager = (function() {
    let permission = Notification.permission;

    async function requestPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }

        if (permission === 'default') {
            try {
                permission = await Notification.requestPermission();
            } catch (e) {
                console.warn('Notification permission request failed:', e);
            }
        }
        return permission;
    }

    function show(taskName, settings) {
        if (!settings.notifications || permission !== 'granted') return;

        try {
            new Notification('⏰ Power Schedule Alarm', {
                body: `Time for: ${taskName}`,
                icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%234f46e5\'/%3E%3Ctext x=\'30\' y=\'70\' fill=\'white\' font-size=\'50\'%3E⏰%3C/text%3E%3C/svg%3E',
                tag: 'schedule-alarm',
                requireInteraction: true,
                silent: true
            });
        } catch (e) {
            console.warn('Notification failed:', e);
        }
    }

    return {
        requestPermission,
        show
    };
})();

// ==================== UI MANAGER ====================
const UI = (function() {
    let toastContainer = null;

    function init() {
        toastContainer = document.createElement('div');
        toastContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'info', duration = 3000) {
        if (!toastContainer) init();
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#4f46e5'};
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: 500;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
            pointer-events: auto;
            min-width: 200px;
            text-align: center;
        `;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    function updateDayTabs(activeDay) {
        document.querySelectorAll('.day-tab').forEach(tab => {
            const isActive = tab.dataset.day === activeDay;
            tab.classList.toggle('active', isActive);
        });
    }

    function formatTimeForDisplay(time24) {
        if (!time24) return '12:00 AM';
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    return {
        init,
        showToast,
        updateDayTabs,
        formatTimeForDisplay
    };
})();

// ==================== TASK RENDERER ====================
const TaskRenderer = (function() {
    function render(container, tasks, day, onUpdate) {
        if (!container) return;

        container.innerHTML = '';

        if (!tasks || tasks.length === 0) {
            container.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; color: var(--text-muted);">
                    No tasks for ${day}. Click "Add Task" to create one.
                </div>
            `;
            return;
        }

        const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

        sortedTasks.forEach((task, index) => {
            const row = createTaskRow(task, index, day, onUpdate);
            container.appendChild(row);
        });

        setupDragAndDrop(container, onUpdate);
    }

    function createTaskRow(task, index, day, onUpdate) {
        const row = document.createElement('div');
        row.className = `task-row ${task.done ? 'completed' : ''}`;
        row.draggable = true;
        row.dataset.index = index;
        row.dataset.taskId = task.id;

        const tagClass = `tag-${task.tag?.toLowerCase() || 'foundation'}`;

        row.innerHTML = `
            <div class="handle" draggable="false">⠿</div>
            <div class="task-time">${UI.formatTimeForDisplay(task.time)}</div>
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div><span class="tag ${tagClass}" data-task-id="${task.id}">${escapeHtml(task.tag || 'Foundation')}</span></div>
            <div class="actions">
                <button class="btn-icon" data-action="toggle-done" data-task-id="${task.id}" title="Toggle completion">${task.done ? '✅' : '⬜'}</button>
                <button class="btn-icon" data-action="toggle-alarm" data-task-id="${task.id}" title="Toggle alarm">${task.alarm ? '🔔' : '🔕'}</button>
                <button class="btn-icon" data-action="delete" data-task-id="${task.id}" title="Delete task">🗑️</button>
            </div>
        `;

        row.querySelectorAll('.btn-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const action = btn.dataset.action;
                const taskId = parseInt(btn.dataset.taskId);
                onUpdate(action, taskId);
            });
        });

        row.querySelector('.tag').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const taskId = parseInt(e.target.dataset.taskId);
            onUpdate('change-category', taskId);
        });

        row.querySelector('.task-text').addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
            editTaskText(e.target, task, onUpdate);
        });

        return row;
    }

    function editTaskText(element, task, onUpdate) {
        const currentText = task.text;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.width = '100%';
        input.style.padding = '4px 8px';
        input.style.border = '2px solid var(--primary)';
        input.style.borderRadius = '4px';

        input.onblur = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                onUpdate('edit-text', task.id, newText);
            } else {
                element.textContent = currentText;
            }
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') {
                element.textContent = currentText;
            }
        };

        element.innerHTML = '';
        element.appendChild(input);
        input.focus();
    }

    function setupDragAndDrop(container, onUpdate) {
        let draggedItem = null;

        container.addEventListener('dragstart', (e) => {
            const row = e.target.closest('.task-row');
            if (!row) return;
            
            draggedItem = row;
            row.classList.add('dragging');
            e.dataTransfer.setData('text/plain', row.dataset.index);
        });

        container.addEventListener('dragend', (e) => {
            const row = e.target.closest('.task-row');
            if (row) row.classList.remove('dragging');
            draggedItem = null;
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedItem) return;

            const rows = [...container.querySelectorAll('.task-row')];
            const newOrder = rows.map(row => parseInt(row.dataset.taskId));
            onUpdate('reorder', newOrder);
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    return { render };
})();

// ==================== MAIN APP ====================
// ==================== MAIN APP ====================
const App = (function() {
    let schedule = DataManager.loadSchedule();
    let settings = DataManager.loadSettings();

    async function init() {
        console.log('🚀 Initializing Power Schedule...');

        UI.init();
        applyTheme();
        updateDayTabs();
        
        loadSettingsToUI();
        loadSavedAudio();
        
        startClock();
        
        const currentDay = AppState.getCurrentDay();
        loadTasksForDay(currentDay);
        
        await NotificationManager.requestPermission();
        await WakeLockManager.request();
        
        document.addEventListener('click', () => {
            AudioManager.init();
        }, { once: true });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                saveAll();
            }
        });

        console.log('✅ App initialized');
    }

    function saveAll() {
        DataManager.saveSchedule(schedule);
        DataManager.saveSettings(settings);
    }

    function applyTheme() {
        const theme = settings.theme;
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    function loadSettingsToUI() {
        const soundSelect = document.getElementById('set-sound');
        const volumeInput = document.getElementById('set-vol');
        const volLabel = document.getElementById('vol-label');
        const customOption = document.getElementById('custom-option');

        if (soundSelect) {
            if (settings.customSound) {
                soundSelect.value = 'custom';
                if (customOption) customOption.style.display = 'block';
            } else {
                soundSelect.value = settings.sound;
            }
        }

        if (volumeInput && volLabel) {
            volumeInput.value = settings.volume;
            volLabel.textContent = settings.volume;
        }
    }

    function updateDayTabs() {
        const currentDay = AppState.getCurrentDay();
        document.querySelectorAll('.day-tab').forEach(tab => {
            const isActive = tab.dataset.day === currentDay;
            tab.classList.toggle('active', isActive);
        });
    }

    function loadTasksForDay(day) {
        const container = document.getElementById('task-container');
        const dayTasks = schedule[day] || [];
        
        // Simple render function
        renderTasks(container, dayTasks, day);
    }

    // SIMPLE RENDER FUNCTION
    function renderTasks(container, tasks, day) {
        if (!container) return;
        container.innerHTML = '';

        if (!tasks || tasks.length === 0) {
            container.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; color: var(--text-muted);">
                    No tasks for ${day}. Click "Add Task" to create one.
                </div>
            `;
            return;
        }

        // Sort by time
        const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

        sortedTasks.forEach((task) => {
            const row = createTaskRow(task);
            container.appendChild(row);
        });
    }
    function loadSavedAudio() {
        if (settings.customSound) {
            // Update UI to show custom option
            const customOption = document.getElementById('custom-option');
            const soundSelect = document.getElementById('set-sound');
            
            if (customOption) {
                customOption.style.display = 'block';
                // Try to get filename from stored data (optional)
                try {
                    const savedAudio = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS));
                    if (savedAudio && savedAudio.customSound) {
                        // Optionally store filename separately if you want
                    }
                } catch (e) {}
            }
            
            if (soundSelect && settings.sound === settings.customSound) {
                soundSelect.value = 'custom';
            }
            
            // Preload audio
            const audio = AppState.getAlarmAudio();
            audio.src = settings.customSound;
            audio.load();
            
            console.log('Saved audio loaded from localStorage');
        }
    }

    // SIMPLE TASK ROW CREATION
    function createTaskRow(task) {
        const row = document.createElement('div');
        row.className = `task-row ${task.done ? 'completed' : ''}`;
        row.dataset.taskId = task.id;

        const tagClass = `tag-${task.tag?.toLowerCase() || 'foundation'}`;
        const timeDisplay = UI.formatTimeForDisplay(task.time);

        row.innerHTML = `
            <div class="handle">⠿</div>
            <div class="task-time">${timeDisplay}</div>
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div><span class="tag ${tagClass}">${escapeHtml(task.tag || 'Foundation')}</span></div>
            <div class="actions">
                <button class="btn-icon toggle-done" title="Toggle completion">${task.done ? '✅' : '⬜'}</button>
                <button class="btn-icon toggle-alarm" title="Toggle alarm">${task.alarm ? '🔔' : '🔕'}</button>
                <button class="btn-icon delete-task" title="Delete task">🗑️</button>
            </div>
        `;

        // Add event listeners directly
        const doneBtn = row.querySelector('.toggle-done');
        const alarmBtn = row.querySelector('.toggle-alarm');
        const deleteBtn = row.querySelector('.delete-task');
        const tagSpan = row.querySelector('.tag');

        doneBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            task.done = !task.done;
            saveAll();
            loadTasksForDay(AppState.getCurrentDay());
            UI.showToast(task.done ? '✅ Task completed' : '↩️ Task reopened', 'success');
        });

        alarmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            task.alarm = !task.alarm;
            saveAll();
            loadTasksForDay(AppState.getCurrentDay());
            UI.showToast(`🔔 Alarm ${task.alarm ? 'enabled' : 'disabled'}`, 'success');
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (confirm('Delete this task?')) {
                const day = AppState.getCurrentDay();
                const index = schedule[day].findIndex(t => t.id === task.id);
                if (index !== -1) {
                    schedule[day].splice(index, 1);
                    saveAll();
                    loadTasksForDay(day);
                    UI.showToast('🗑️ Task deleted', 'success');
                }
            }
        });

        tagSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const categories = ["Foundation", "Growth", "Productivity", "Personal"];
            const currentIndex = categories.indexOf(task.tag);
            const nextIndex = (currentIndex + 1) % categories.length;
            task.tag = categories[nextIndex];
            saveAll();
            loadTasksForDay(AppState.getCurrentDay());
            UI.showToast(`🏷️ Category changed to ${task.tag}`, 'success');
        });

        // Double-click to edit text
        const textSpan = row.querySelector('.task-text');
        textSpan.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const currentText = task.text;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.style.width = '100%';
            input.style.padding = '4px 8px';

            input.onblur = () => {
                const newText = input.value.trim();
                if (newText && newText !== currentText) {
                    task.text = newText;
                    saveAll();
                    loadTasksForDay(AppState.getCurrentDay());
                    UI.showToast('✏️ Task updated', 'success');
                } else {
                    textSpan.textContent = currentText;
                }
            };

            input.onkeydown = (e) => {
                if (e.key === 'Enter') input.blur();
                if (e.key === 'Escape') {
                    textSpan.textContent = currentText;
                }
            };

            textSpan.innerHTML = '';
            textSpan.appendChild(input);
            input.focus();
        });

        return row;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function startClock() {
        function tick() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const clock = document.getElementById('clock');
            if (clock) clock.textContent = timeString;

            checkAlarms(now);
        }

        setInterval(tick, 1000);
        tick();
    }

    function checkAlarms(now) {
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const dayIndex = now.getDay();
        const dayName = CONFIG.DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
        const alarmKey = `${dayName}-${currentTime}`;

        if (AppState.getLastAlarmTriggered() === alarmKey) return;

        const tasks = schedule[dayName] || [];
        tasks.forEach(task => {
            if (task.alarm && !task.done && task.time === currentTime) {
                triggerAlarm(task);
                AppState.setLastAlarmTriggered(alarmKey);
            }
        });
    }

    function triggerAlarm(task) {
        UI.showToast(`⏰ ALARM: ${task.text}`, 'info', 10000);
        
        if (settings.vibration && navigator.vibrate) {
            navigator.vibrate(CONFIG.VIBRATION_PATTERN);
        }

        WakeLockManager.request();
        AudioManager.play(settings.sound, settings.volume, true);
        NotificationManager.show(task.text, settings);
    }

    function stopAlarm() {
        AudioManager.stopAll();
        if (navigator.vibrate) {
            navigator.vibrate(0);
        }
        UI.showToast('🔕 Alarm stopped', 'info');
    }

    // Event Handlers
    window.togglePanel = function(id) {
        const panel = document.getElementById(id);
        const isVisible = panel.style.display === 'block';
        document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
        panel.style.display = isVisible ? 'none' : 'block';
    };

    window.toggleTheme = function() {
        settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveAll();
    };

    window.updateSettings = function() {
        const soundSelect = document.getElementById('set-sound');
        const volumeInput = document.getElementById('set-vol');

        if (soundSelect) {
            if (soundSelect.value === 'custom' && settings.customSound) {
                settings.sound = settings.customSound;
            } else if (soundSelect.value !== 'custom') {
                settings.sound = soundSelect.value;
            }
        }

        if (volumeInput) {
            settings.volume = parseInt(volumeInput.value) || 50;
            document.getElementById('vol-label').textContent = settings.volume;
        }

        saveAll();
    };

    window.handleFileUpload = function() {
        const fileInput = document.getElementById('alarm-upload');
        const errorDiv = document.getElementById('upload-error');
        const file = fileInput?.files[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('audio/')) {
            errorDiv.textContent = 'Please upload a valid audio file (MP3, WAV, OGG)';
            errorDiv.style.display = 'block';
            fileInput.value = '';
            return;
        }

        // Check file size (max 5MB for localStorage)
        if (file.size > CONFIG.AUDIO.MAX_SIZE) {
            errorDiv.textContent = 'File too large (max 5MB)';
            errorDiv.style.display = 'block';
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                // Convert file to base64 string for localStorage
                const base64Audio = e.target.result;
                
                // Save to settings
                settings.customSound = base64Audio;
                settings.sound = base64Audio;
                
                // Update UI
                const customOption = document.getElementById('custom-option');
                const soundSelect = document.getElementById('set-sound');
                
                if (customOption) {
                    customOption.style.display = 'block';
                    customOption.textContent = file.name; // Show filename in dropdown
                }
                if (soundSelect) soundSelect.value = 'custom';
                
                // Save to localStorage immediately
                saveAll();
                
                // Preload audio for faster playback
                const audio = AppState.getAlarmAudio();
                audio.src = base64Audio;
                audio.load();
                
                errorDiv.style.display = 'none';
                UI.showToast(`✅ Audio "${file.name}" uploaded successfully`, 'success');
                
                console.log('Audio file saved to localStorage:', file.name);
                
            } catch (err) {
                console.error('File processing error:', err);
                errorDiv.textContent = 'Error: Failed to process audio file.';
                errorDiv.style.display = 'block';
            }
        };

        reader.onerror = function() {
            errorDiv.textContent = 'Error: Failed to read file.';
            errorDiv.style.display = 'block';
            fileInput.value = '';
        };

        // Read as Data URL (base64)
        reader.readAsDataURL(file);
    };


    window.previewSound = function() {
        AudioManager.preview(settings.sound, settings.volume);
        UI.showToast('Testing sound...', 'info');
        
        setTimeout(() => {
            AudioManager.stopAll();
        }, 3000);
    };

    window.stopAlarm = stopAlarm;

    window.switchDay = function(day, element) {
        AppState.setCurrentDay(day);
        updateDayTabs();
        loadTasksForDay(day);
    };

    window.addTask = function() {
    const timeInput = document.getElementById('t-time');
    const ampmSelect = document.getElementById('task-ampm');
    const nameInput = document.getElementById('t-name');
    const tagSelect = document.getElementById('t-tag');
    const repeatSelect = document.getElementById('t-repeat');
    const errorDiv = document.getElementById('task-error');

    if (!nameInput.value.trim()) {
        errorDiv.textContent = 'Please enter an activity';
        errorDiv.style.display = 'block';
        nameInput.focus();
        return;
    }

    errorDiv.style.display = 'none';

    // Get time from input (in 24-hour format: HH:MM)
    let timeValue = timeInput.value;
    const ampm = ampmSelect.value;
    
    // Parse the 24-hour time
    let [hours, minutes] = timeValue.split(':').map(Number);
    
    // Convert to 24-hour format based on AM/PM selection
    if (ampm === 'PM' && hours < 12) {
        hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
    }
    
    // Format as 24-hour string for storage
    const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const newTask = {
        id: Date.now() + Math.random(),
        time: time24,
        text: nameInput.value.trim(),
        tag: tagSelect.value,
        alarm: true,
        done: false
    };

    const repeat = repeatSelect.value;
    
    if (repeat === 'daily') {
        CONFIG.DAYS.forEach(day => {
            schedule[day].push({ ...newTask, id: Date.now() + Math.random() });
        });
        UI.showToast('Task added to all days', 'success');
    } else if (repeat === 'weekdays') {
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
            schedule[day].push({ ...newTask, id: Date.now() + Math.random() });
        });
        UI.showToast('Task added to weekdays', 'success');
    } else {
        const currentDay = AppState.getCurrentDay();
        schedule[currentDay].push(newTask);
        UI.showToast('Task added', 'success');
    }

    saveAll();
    loadTasksForDay(AppState.getCurrentDay());
    nameInput.value = '';
};

    window.resetAll = function() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    };

    window.addEventListener('beforeunload', () => {
        AudioManager.stopAll();
        WakeLockManager.release();
        saveAll();
    });

    return { init };
})();

// Start the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}