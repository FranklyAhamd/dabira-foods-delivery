# Accessing Mobile App from Your Phone

## Quick Setup

Your mobile app is now configured to be accessible from your phone on the same Wi-Fi network!

## Steps to Access:

1. **Make sure your phone and computer are on the same Wi-Fi network**

2. **Find your computer's IP address:**
   - Windows: Run `ipconfig` in Command Prompt
   - Look for "IPv4 Address" under your active Wi-Fi adapter
   - Your current Wi-Fi IP: **192.168.41.12** (as of your last check)

3. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend should already be configured to accept network connections.

4. **Start the mobile app:**
   ```bash
   cd mobile
   npm start
   ```
   The app will now be accessible on the network!

5. **Access from your phone:**
   - Open your phone's web browser (Chrome, Safari, etc.)
   - Go to: **http://192.168.41.12:3001**
   - The app will automatically connect to the backend API at the same IP

## Important Notes:

- **Firewall**: If you can't access, you may need to allow port 3001 and 5000 through Windows Firewall
- **IP Changes**: If your IP address changes (when you reconnect to Wi-Fi), you'll need to update the CORS settings in `backend/src/server.js`
- **Automatic Detection**: The mobile app automatically detects if it's being accessed via network IP and adjusts the API URL accordingly

## Troubleshooting:

### Can't access from phone?
1. Check both devices are on the same Wi-Fi network
2. Verify your computer's IP hasn't changed (run `ipconfig` again)
3. Try disabling Windows Firewall temporarily to test
4. Make sure the backend server is running on port 5000
5. Make sure the mobile app is running on port 3001

### API connection fails?
- The app automatically uses the network IP when accessed remotely
- If you see CORS errors, check that your IP is in the backend CORS settings
- Your current IP (192.168.41.12) is already added to the backend CORS whitelist

### Update IP address:
If your IP changes, update it in:
- `backend/src/server.js` (lines 25-26 and 71-72)
- The mobile app will automatically detect and use the correct IP





