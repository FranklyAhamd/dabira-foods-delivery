const { spawn } = require('child_process');
const path = require('path');

// Colors for terminal output
const colors = {
  backend: '\x1b[36m', // Cyan
  admin: '\x1b[32m',   // Green
  mobile: '\x1b[35m',  // Magenta
  reset: '\x1b[0m'     // Reset
};

// Function to start a service
function startService(name, dir, command, args) {
  console.log(`${colors[name]}Starting ${name}...${colors.reset}`);
  
  const cwd = path.join(__dirname, dir);
  const child = spawn(command, args, { 
    cwd,
    shell: true,
    stdio: 'pipe'
  });
  
  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${colors[name]}[${name}] ${line}${colors.reset}`);
    });
  });
  
  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${colors[name]}[${name}] ${line}${colors.reset}`);
    });
  });
  
  child.on('close', (code) => {
    console.log(`${colors[name]}${name} process exited with code ${code}${colors.reset}`);
  });
  
  return child;
}

// Start all services
console.log('Starting all Dabira Foods services...\n');

const backend = startService('backend', 'backend', 'npm', ['run', 'dev']);
const admin = startService('admin', 'admin', 'npm', ['start']);
const mobile = startService('mobile', 'mobile', 'npm', ['start']);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down all services...');
  backend.kill();
  admin.kill();
  mobile.kill();
  process.exit(0);
});

console.log('\nAll services starting! Press Ctrl+C to stop all services.\n');




