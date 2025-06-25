document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voiceBtn');
    const statusEl = document.getElementById('status');
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            statusEl.textContent = 'Listening... Speak now!';
            voiceBtn.classList.add('listening');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            taskInput.value = transcript;
            statusEl.textContent = 'Task recognized: ' + transcript;
            voiceBtn.classList.remove('listening');
            
            // Auto-submit after short delay
            setTimeout(() => {
                addTask(transcript);
            }, 500);
        };

        recognition.onerror = function(event) {
            statusEl.textContent = 'Error occurred: ' + event.error;
            voiceBtn.classList.remove('listening');
        };

        recognition.onend = function() {
            if (!voiceBtn.classList.contains('listening')) {
                statusEl.textContent = 'Ready';
            }
        };
    } else {
        voiceBtn.disabled = true;
        statusEl.textContent = 'Speech recognition not supported in this browser';
    }

    // Voice button click handler
    voiceBtn.addEventListener('click', function() {
        if (recognition) {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
                voiceBtn.classList.remove('listening');
                statusEl.textContent = 'Ready';
            } else {
                recognition.start();
            }
        }
    });

    // Add task button click handler
    addBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    // Enter key handler for input
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTask(taskText);
                taskInput.value = '';
            }
        }
    });

    // Add task to list
    function addTask(text) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', function() {
            taskItem.classList.toggle('completed');
        });
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = text;
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
        });
        
        taskActions.appendChild(deleteBtn);
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskActions);
        
        taskList.appendChild(taskItem);
        
        // Scroll to new task
        taskItem.scrollIntoView({ behavior: 'smooth' });
        
        // Update status
        statusEl.textContent = 'Task added: ' + text;
    }
});