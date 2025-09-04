class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskIdCounter = this.getNextId();
        
        this.taskInput = document.getElementById('taskInput');
        this.addTaskForm = document.getElementById('addTaskForm');
        this.tasksList = document.getElementById('tasksList');
        this.statsElement = document.getElementById('stats');
        
        this.init();
    }
    
    init() {
        this.addTaskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        this.renderTasks();
        this.updateStats();
    }
    
    handleAddTask(e) {
        e.preventDefault();
        const taskText = this.taskInput.value.trim();
        
        if (taskText) {
            this.addTask(taskText);
            this.taskInput.value = '';
        }
    }
    
    addTask(text) {
        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            createdAt: Date.now()
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }
    
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }
    
    renderTasks() {
        this.tasksList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.tasksList.appendChild(taskElement);
        });
    }
    
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn" data-id="${task.id}">×</button>
        `;
        
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('click', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        
        return li;
    }
    
    renderEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
            <p>No tasks yet</p>
            <span>Add a task to get started!</span>
        `;
        this.tasksList.appendChild(emptyDiv);
    }
    
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        let statsText = '';
        if (totalTasks === 0) {
            statsText = '0 tasks';
        } else if (totalTasks === 1) {
            statsText = completedTasks === 1 ? '1 task completed' : '1 task pending';
        } else {
            if (completedTasks === totalTasks) {
                statsText = `${totalTasks} tasks completed`;
            } else if (completedTasks === 0) {
                statsText = `${totalTasks} tasks pending`;
            } else {
                statsText = `${completedTasks} completed, ${pendingTasks} pending`;
            }
        }
        
        this.statsElement.innerHTML = `<span class="tasks-count">${statsText}</span>`;
    }
    
    loadTasks() {
        try {
            const saved = localStorage.getItem('todoTasks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }
    
    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
    
    getNextId() {
        const maxId = this.tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
        return maxId + 1;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});