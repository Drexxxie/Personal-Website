class AISmartTodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('aiTodoTasks')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'priority';
        this.editingTaskId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.generateAIInsights();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.tasksContainer = document.getElementById('tasksContainer');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortSelect');
        this.aiSuggestions = document.getElementById('aiSuggestions');
        this.insightsContent = document.getElementById('insightsContent');
        
        // Stats elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
        this.productivityScoreEl = document.getElementById('productivityScore');
        
        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editPrioritySelect = document.getElementById('editPrioritySelect');
        this.editCategorySelect = document.getElementById('editCategorySelect');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        this.closeModalBtn = document.getElementById('closeModal');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.taskInput.addEventListener('input', () => this.showAISuggestions());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
        
        this.sortSelect.addEventListener('change', (e) => this.setSortOrder(e.target.value));
        
        // Modal events
        this.saveEditBtn.addEventListener('click', () => this.saveEditedTask());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: this.detectPriority(text),
            category: this.detectCategory(text),
            aiSuggested: false
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.hideAISuggestions();
        this.renderTasks();
        this.updateStats();
        this.generateAIInsights();
    }

    detectPriority(text) {
        const highPriorityKeywords = ['urgent', 'asap', 'important', 'critical', 'deadline', 'emergency', 'priority', 'must', 'immediately'];
        const mediumPriorityKeywords = ['soon', 'today', 'tomorrow', 'this week', 'meeting', 'call', 'email'];
        
        const lowerText = text.toLowerCase();
        
        if (highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
            return 'high';
        } else if (mediumPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
            return 'medium';
        }
        return 'low';
    }

    detectCategory(text) {
        const categories = {
            work: ['work', 'office', 'meeting', 'project', 'deadline', 'client', 'email', 'report', 'presentation', 'call'],
            health: ['doctor', 'gym', 'exercise', 'workout', 'medicine', 'appointment', 'health', 'diet', 'run', 'walk'],
            shopping: ['buy', 'purchase', 'shop', 'store', 'grocery', 'market', 'order', 'amazon', 'mall'],
            learning: ['study', 'learn', 'course', 'book', 'read', 'tutorial', 'practice', 'skill', 'training'],
            personal: ['family', 'friend', 'birthday', 'anniversary', 'vacation', 'hobby', 'personal']
        };

        const lowerText = text.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return category;
            }
        }
        return 'other';
    }

    showAISuggestions() {
        const input = this.taskInput.value.trim().toLowerCase();
        if (input.length < 3) {
            this.hideAISuggestions();
            return;
        }

        const suggestions = this.generateSuggestions(input);
        if (suggestions.length > 0) {
            this.aiSuggestions.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item" onclick="todoApp.applySuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            this.aiSuggestions.classList.add('show');
        } else {
            this.hideAISuggestions();
        }
    }

    generateSuggestions(input) {
        const suggestions = [];
        const commonTasks = {
            'meet': ['Schedule team meeting', 'Prepare meeting agenda', 'Send meeting invites'],
            'buy': ['Buy groceries', 'Buy birthday gift', 'Buy office supplies'],
            'call': ['Call doctor for appointment', 'Call client about project', 'Call family'],
            'email': ['Send project update email', 'Reply to pending emails', 'Email weekly report'],
            'exercise': ['Go for a 30-minute walk', 'Do morning workout', 'Schedule gym session'],
            'study': ['Study for 1 hour', 'Complete online course module', 'Review study notes'],
            'clean': ['Clean the house', 'Organize workspace', 'Declutter closet'],
            'plan': ['Plan weekend activities', 'Plan project timeline', 'Plan vacation itinerary']
        };

        for (const [keyword, taskList] of Object.entries(commonTasks)) {
            if (input.includes(keyword)) {
                suggestions.push(...taskList.slice(0, 2));
            }
        }

        return [...new Set(suggestions)].slice(0, 3);
    }

    applySuggestion(suggestion) {
        this.taskInput.value = suggestion;
        this.hideAISuggestions();
        this.taskInput.focus();
    }

    hideAISuggestions() {
        this.aiSuggestions.classList.remove('show');
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.generateAIInsights();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.generateAIInsights();
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            this.editTaskInput.value = task.text;
            this.editPrioritySelect.value = task.priority;
            this.editCategorySelect.value = task.category;
            this.showEditModal();
        }
    }

    showEditModal() {
        this.editModal.classList.add('show');
        this.editTaskInput.focus();
    }

    closeEditModal() {
        this.editModal.classList.remove('show');
        this.editingTaskId = null;
    }

    saveEditedTask() {
        if (!this.editingTaskId) return;

        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.text = this.editTaskInput.value.trim();
            task.priority = this.editPrioritySelect.value;
            task.category = this.editCategorySelect.value;
            task.updatedAt = new Date().toISOString();
            
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.closeEditModal();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    setSortOrder(sortOrder) {
        this.currentSort = sortOrder;
        this.renderTasks();
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        // Apply filter
        switch (this.currentFilter) {
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            case 'pending':
                filtered = filtered.filter(task => !task.completed);
                break;
            case 'high':
                filtered = filtered.filter(task => task.priority === 'high');
                break;
        }

        // Apply sort
        switch (this.currentSort) {
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filtered.sort((a, b) => {
                    // First sort by completion status (incomplete tasks first)
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // Then sort by priority (high to low)
                    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                    if (priorityDiff !== 0) {
                        return priorityDiff;
                    }
                    // Finally sort by creation date (newest first)
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                break;
            case 'category':
                filtered.sort((a, b) => {
                    // First sort by completion status
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // Then by category
                    const categoryDiff = a.category.localeCompare(b.category);
                    if (categoryDiff !== 0) {
                        return categoryDiff;
                    }
                    // Finally by priority within category
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
                break;
            case 'alphabetical':
                filtered.sort((a, b) => {
                    // First sort by completion status
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // Then alphabetically
                    return a.text.localeCompare(b.text);
                });
                break;
            case 'date':
                filtered.sort((a, b) => {
                    // First sort by completion status
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // Then by date
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                break;
            default:
                // Default to priority sorting
                const defaultPriorityOrder = { high: 3, medium: 2, low: 1 };
                filtered.sort((a, b) => {
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    const priorityDiff = defaultPriorityOrder[b.priority] - defaultPriorityOrder[a.priority];
                    if (priorityDiff !== 0) {
                        return priorityDiff;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                break;
        }

        return filtered;
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
            this.tasksContainer.innerHTML = '';
            this.tasksContainer.appendChild(this.emptyState);
            return;
        }

        this.emptyState.style.display = 'none';
        this.tasksContainer.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        
        // Bind events to new task elements
        this.bindTaskEvents();
    }

    createTaskHTML(task) {
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const priorityClass = task.priority === 'high' ? 'high-priority' : 
                            task.priority === 'medium' ? 'medium-priority' : '';
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${priorityClass}" data-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </div>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-category">${task.category}</span>
                        <span class="task-priority ${task.priority}">${task.priority} priority</span>
                        <span class="task-date">${createdDate}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindTaskEvents() {
        // Checkbox events
        document.querySelectorAll('.task-check').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                this.toggleTask(taskId);
            });
        });

        // Edit button events
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                this.editTask(taskId);
            });
        });

        // Delete button events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                this.deleteTask(taskId);
            });
        });
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
        this.productivityScoreEl.textContent = `${productivity}%`;
    }

    generateAIInsights() {
        if (this.tasks.length === 0) {
            this.insightsContent.innerHTML = '<p>Add some tasks to get personalized AI insights and productivity tips!</p>';
            return;
        }

        const insights = [];
        const completed = this.tasks.filter(task => task.completed).length;
        const total = this.tasks.length;
        const highPriority = this.tasks.filter(task => task.priority === 'high' && !task.completed).length;
        const categories = this.getTasksByCategory();

        // Productivity insights
        const productivity = Math.round((completed / total) * 100);
        if (productivity >= 80) {
            insights.push('🎉 Excellent productivity! You\'re completing most of your tasks.');
        } else if (productivity >= 60) {
            insights.push('👍 Good progress! Consider focusing on high-priority items.');
        } else if (productivity >= 40) {
            insights.push('⚡ Room for improvement. Try breaking large tasks into smaller ones.');
        } else {
            insights.push('🎯 Focus time! Start with your highest priority tasks.');
        }

        // Priority insights
        if (highPriority > 0) {
            insights.push(`⚠️ You have ${highPriority} high-priority task${highPriority > 1 ? 's' : ''} pending.`);
        }

        // Category insights
        const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
        if (topCategory && topCategory[1] > 1) {
            insights.push(`📊 Most of your tasks are ${topCategory[0]}-related (${topCategory[1]} tasks).`);
        }

        // Time-based insights
        const today = new Date().toDateString();
        const todayTasks = this.tasks.filter(task => 
            new Date(task.createdAt).toDateString() === today
        ).length;
        
        if (todayTasks > 0) {
            insights.push(`📅 You've added ${todayTasks} task${todayTasks > 1 ? 's' : ''} today.`);
        }

        // Suggestions
        if (this.tasks.filter(task => !task.completed).length > 5) {
            insights.push('💡 Tip: Focus on completing 3-5 tasks at a time for better productivity.');
        }

        this.insightsContent.innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
    }

    getTasksByCategory() {
        const categories = {};
        this.tasks.forEach(task => {
            categories[task.category] = (categories[task.category] || 0) + 1;
        });
        return categories;
    }

    saveTasks() {
        localStorage.setItem('aiTodoTasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new AISmartTodoApp();
});

// Add some demo tasks for first-time users
if (!localStorage.getItem('aiTodoTasks')) {
    setTimeout(() => {
        const demoTasks = [
            'Complete project presentation for Monday meeting',
            'Buy groceries for the week',
            'Call doctor to schedule annual checkup',
            'Study JavaScript for 1 hour',
            'Plan weekend trip with family'
        ];
        
        demoTasks.forEach((taskText, index) => {
            setTimeout(() => {
                if (window.todoApp && window.todoApp.taskInput) {
                    window.todoApp.taskInput.value = taskText;
                    window.todoApp.addTask();
                }
            }, index * 500);
        });
    }, 1000);
}