# AI Smart To-Do List App

A modern, intelligent to-do list application built with HTML, CSS, and JavaScript that uses AI-powered features to enhance productivity.

## Features

### 🧠 AI-Smart Features
- **Automatic Priority Detection**: Analyzes task text to automatically assign priority levels (high, medium, low)
- **Category Classification**: Automatically categorizes tasks into work, health, shopping, learning, personal, or other
- **Smart Suggestions**: Provides intelligent task suggestions as you type
- **AI Insights**: Generates personalized productivity insights and recommendations

### 📱 Core Functionality
- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- **Priority-based automatic arrangement** - Tasks are automatically sorted by priority (high → medium → low)
- Filter tasks by status (all, pending, completed, high priority)
- Sort tasks by priority (default), date, category, or alphabetically
- Real-time statistics dashboard
- Local storage for data persistence

### 🎨 Modern UI/UX
- Beautiful gradient design with smooth animations
- Fully responsive design for all devices
- Intuitive user interface with visual feedback
- Modal dialogs for editing tasks
- Custom checkboxes and buttons

## How to Use

1. **Open the App**: Open `todo-app.html` in your web browser
2. **Add Tasks**: Type your task in the input field and press Enter or click the + button
3. **Smart Features**:
   - The app automatically detects priority based on keywords like "urgent", "important", "deadline"
   - Categories are auto-assigned based on content (work, health, shopping, etc.)
   - Get suggestions as you type common task beginnings
4. **Priority System**:
   - **Tasks are automatically arranged by priority** (high → medium → low)
   - Incomplete tasks always appear before completed ones
   - High-priority tasks have red borders and enhanced visual styling
   - Medium-priority tasks have yellow/orange borders
   - Low-priority tasks have green borders
5. **Manage Tasks**:
   - Click the checkbox to mark tasks complete
   - Use the edit button to modify task details and priority levels
   - Click delete to remove tasks
6. **Filter & Sort**: Use the filter buttons and sort dropdown to organize your view
7. **Track Progress**: Monitor your productivity with the stats dashboard and AI insights

## AI Keywords for Priority Detection

### High Priority Keywords:
- urgent, asap, important, critical, deadline, emergency, priority, must, immediately

### Medium Priority Keywords:
- soon, today, tomorrow, this week, meeting, call, email

### Category Keywords:

**Work**: work, office, meeting, project, deadline, client, email, report, presentation, call
**Health**: doctor, gym, exercise, workout, medicine, appointment, health, diet, run, walk
**Shopping**: buy, purchase, shop, store, grocery, market, order, amazon, mall
**Learning**: study, learn, course, book, read, tutorial, practice, skill, training
**Personal**: family, friend, birthday, anniversary, vacation, hobby, personal

## Technical Details

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with flexbox, grid, animations, and priority-based visual indicators
- **Vanilla JavaScript**: No external dependencies, pure ES6+ code with intelligent sorting algorithms
- **Local Storage**: Automatic data persistence
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smart Priority System**: Multi-level sorting (completion status → priority → creation date)

## File Structure

```
├── todo-app.html      # Main HTML file
├── todo-styles.css    # CSS styling
├── todo-script.js     # JavaScript functionality
└── README-todo-app.md # This documentation
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Demo Tasks

The app includes demo tasks on first load to showcase the AI features:
- Complete project presentation for Monday meeting (Work, High Priority)
- Buy groceries for the week (Shopping, Low Priority)
- Call doctor to schedule annual checkup (Health, Medium Priority)
- Study JavaScript for 1 hour (Learning, Low Priority)
- Plan weekend trip with family (Personal, Low Priority)

## Future Enhancements

- Task due dates and reminders
- Collaboration features
- Data export/import
- Advanced AI insights with machine learning
- Integration with calendar apps
- Dark mode theme

---

**Created with ❤️ using HTML, CSS, and JavaScript**