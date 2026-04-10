---
description: How to run the Swasthya AI Project (Backend + Frontend)
---

# How to Run the Project

Follow these steps to start the application and ensure the frontend can talk to the backend.

## 1. Start the Backend Server
Go to your backend directory and run:
`npm run start` or `node server.js`
> Make sure it's listening on port **3000**.

## 2. Update the API IP Address
If you are testing on a **physical phone**, you must update the `BASE_URL` to match your computer's current IP.

1.  Open **Windows PowerShell** or Command Prompt.
2.  Type `ipconfig` and look for **IPv4 Address** (e.g., `192.168.1.5` or `10.121.xx.xx`).
3.  Open the following files in the frontend project:
    - [personalinfoapi.js](file:///d:/swasthya%20ai%20frontend/Swasth-AI/src/api/personalinfoapi.js)
    - [chatapi.js](file:///d:/swasthya%20ai%20frontend/Swasth-AI/src/api/chatapi.js)
4.  Update the `BASE_URL` at the top:
    ```javascript
    const BASE_URL = "http://YOUR_NEW_IP:3000";
    ```

## 3. Start the Expo Frontend
In your frontend directory, run:
`npx expo start --clear`
> Use the **Expo Go** app on your phone to scan the QR code.
> **Note:** Your phone and computer MUST be on the same Wi-Fi/Hotspot.

## 4. Troubleshooting (Tunnels)
If your phone cannot connect to the local IP, use a tunnel:
1. Run: `npx localtunnel --port 3000`
2. Copy the URL (e.g., `https://fancy-cat-123.loca.lt`)
3. Set that URL as the `BASE_URL` in both API files.
4. **Important:** Open that URL in your phone's browser once and click "Click to Continue" before using the app.
