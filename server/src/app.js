const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'SMTOps API is running' });
});

const authRoutes = require('./routes/auth.route');
const teamRoutes = require('./routes/team.route');
const userRoutes = require('./routes/user.route');
const handoverRoutes = require('./routes/handover.route');
const issueRoutes = require('./routes/issue.route');
const machineRoutes = require('./routes/machine.route');
const taskRoutes = require('./routes/task.route');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/handovers', handoverRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
