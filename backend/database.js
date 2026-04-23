const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ems.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Employee (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT,
                email TEXT UNIQUE,
                password TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS Task (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employeeId INTEGER,
                taskTitle TEXT,
                taskDescription TEXT,
                taskDate TEXT,
                category TEXT,
                active BOOLEAN,
                newTask BOOLEAN,
                completed BOOLEAN,
                failed BOOLEAN,
                FOREIGN KEY(employeeId) REFERENCES Employee(id)
            )`, () => {
                // Seed Initial Data
                seedDatabase();
            });
        });
    }
});

function seedDatabase() {
    db.get("SELECT COUNT(*) AS count FROM Employee", (err, row) => {
        if (row && row.count === 0) {
            console.log("Seeding database with default employees and tasks...");
            
            const employees = [
                {
                    "firstName": "Arjun",
                    "email": "e@e.com",
                    "password": "123",
                    "tasks": [
                        {
                            "active": true,
                            "newTask": true,
                            "completed": false,
                            "failed": false,
                            "taskTitle": "Update website",
                            "taskDescription": "Revamp the homepage design",
                            "taskDate": "2024-10-12",
                            "category": "Design" 
                        },
                        {
                            "active": false,
                            "newTask": false,
                            "completed": true,
                            "failed": false,
                            "taskTitle": "Client meeting",
                            "taskDescription": "Discuss project requirements",
                            "taskDate": "2024-10-10",
                            "category": "Meeting"
                        },
                        {
                            "active": true,
                            "newTask": false,
                            "completed": false,
                            "failed": false,
                            "taskTitle": "Fix bugs",
                            "taskDescription": "Resolve bugs reported in issue tracker",
                            "taskDate": "2024-10-14",
                            "category": "Development"
                        }
                    ]
                },
                {
                    "firstName": "Sneha",
                    "email": "employee2@example.com",
                    "password": "123",
                    "tasks": [
                        {
                            "active": true,
                            "newTask": false,
                            "completed": false,
                            "failed": false,
                            "taskTitle": "Database optimization",
                            "taskDescription": "Optimize queries for better performance",
                            "taskDate": "2024-10-11",
                            "category": "Database"
                        },
                        {
                            "active": false,
                            "newTask": false,
                            "completed": true,
                            "failed": false,
                            "taskTitle": "Design new feature",
                            "taskDescription": "Create mockups for the new feature",
                            "taskDate": "2024-10-09",
                            "category": "Design"
                        }
                    ]
                }
            ];

            const insertEmployee = db.prepare(`INSERT INTO Employee (firstName, email, password) VALUES (?, ?, ?)`);
            const insertTask = db.prepare(`INSERT INTO Task (employeeId, taskTitle, taskDescription, taskDate, category, active, newTask, completed, failed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                employees.forEach((emp) => {
                    insertEmployee.run(emp.firstName, emp.email, emp.password, function(err) {
                        if (err) return console.error(err);
                        const empId = this.lastID;
                        emp.tasks.forEach(task => {
                            insertTask.run(empId, task.taskTitle, task.taskDescription, task.taskDate, task.category, task.active ? 1 : 0, task.newTask ? 1 : 0, task.completed ? 1 : 0, task.failed ? 1 : 0);
                        });
                    });
                });
                db.run('COMMIT', () => {
                    console.log("Database seated successfully");
                    insertEmployee.finalize();
                    insertTask.finalize();
                });
            });
        }
    });
}

module.exports = db;
