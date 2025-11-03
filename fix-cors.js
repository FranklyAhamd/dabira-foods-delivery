const fs = require('fs');
const path = require('path');

// Path to .env file
const envPath = path.join(__dirname, 'backend', '.env');

try {
  // Read the current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace the admin URL port from 3001 to 3000
  envContent = envContent.replace(
    'ADMIN_APP_URL="http://localhost:3001"', 
    'ADMIN_APP_URL="http://localhost:3000"'
  );
  
  // Replace the mobile URL port from 8081 to 3001
  envContent = envContent.replace(
    'MOBILE_APP_URL="http://localhost:8081"', 
    'MOBILE_APP_URL="http://localhost:3001"'
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ CORS configuration fixed!');
  console.log('- Admin URL updated to port 3000');
  console.log('- Mobile URL updated to port 3001');
  console.log('\nPlease restart your backend server for changes to take effect:');
  console.log('1. Stop the current backend server (Ctrl+C)');
  console.log('2. Start it again with: npm run backend');
  
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
  console.log('\nPlease manually edit backend/.env:');
  console.log('Change ADMIN_APP_URL="http://localhost:3001" to ADMIN_APP_URL="http://localhost:3000"');
  console.log('Change MOBILE_APP_URL="http://localhost:8081" to MOBILE_APP_URL="http://localhost:3001"');
}
