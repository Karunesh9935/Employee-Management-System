const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static React build files
app.use(express.static(path.join(__dirname, '../dist')));

// GET all employees with tasks and computed taskCounts
app.get('/api/employees', (req, res) => {
    db.all("SELECT * FROM Employee", [], (err, employees) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!employees || employees.length === 0) return res.json([]);

        db.all("SELECT * FROM Task", [], (err, tasks) => {
            if (err) return res.status(500).json({ error: err.message });

            // Format data to match original React expectations
            const formattedEmployees = employees.map(emp => {
                const empTasks = tasks.filter(t => t.employeeId === emp.id).map(t => ({
                    ...t,
                    active: t.active === 1,
                    newTask: t.newTask === 1,
                    completed: t.completed === 1,
                    failed: t.failed === 1
                }));

                const taskCounts = {
                    active: empTasks.filter(t => t.active).length,
                    newTask: empTasks.filter(t => t.newTask).length,
                    completed: empTasks.filter(t => t.completed).length,
                    failed: empTasks.filter(t => t.failed).length
                };

                return {
                    ...emp,
                    tasks: empTasks,
                    taskCounts
                };
            });

            res.json(formattedEmployees);
        });
    });
});

// POST to create an employee
app.post('/api/employees', (req, res) => {
    const { firstName, email, password } = req.body;
    db.run(`INSERT INTO Employee (firstName, email, password) VALUES (?, ?, ?)`, [firstName, email, password], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, firstName, email, password, tasks: [], taskCounts: { active: 0, newTask: 0, completed: 0, failed: 0 } });
    });
});

// POST to create a task for a specific employee
app.post('/api/tasks', (req, res) => {
    const { firstName, taskTitle, taskDescription, taskDate, category, active, newTask, completed, failed } = req.body;

    // Find employeeId by firstName since the frontend passes asignTo which is firstName
    if (firstName) {
        db.get("SELECT id FROM Employee WHERE firstName = ?", [firstName], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: "Employee not found" });
            insertTask(row.id);
        });
    } else {
        res.status(400).json({ error: "firstName required" });
    }

    function insertTask(eId) {
        db.run(`INSERT INTO Task (employeeId, taskTitle, taskDescription, taskDate, category, active, newTask, completed, failed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [eId, taskTitle, taskDescription, taskDate, category, active ? 1 : 0, newTask ? 1 : 0, completed ? 1 : 0, failed ? 1 : 0], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, taskId: this.lastID });
        });
    }
});

// Handle any other routes by serving the React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
