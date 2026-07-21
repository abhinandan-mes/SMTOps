require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketModule = require('./socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
socketModule.init(server);

server.listen(PORT, () => {
  console.log(`SMTOps Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
