# Mail Tracker – Firefox Extension

**Mail Tracker** is a privacy-focused, open-source add-on for Gmail and Yahoo Mail. It injects a lightweight tracking pixel into outgoing emails, enabling you to monitor when your messages are opened. View all tracked messages in an elegant dashboard and receive instant alerts.

---

## 🔍 Key Highlights

* **Email Open Tracking**: Injects a minimal tracking pixel into emails as you send them.
* **Interactive Dashboard**: Browse tracked messages, view open statuses, and explore usage statistics.
* **Instant Alerts**: Get real-time notifications the moment recipients open your email.
* **Multi-Mail Support**: Works seamlessly with both Gmail and Yahoo Mail.
* **Self-Hosted Backend**: All tracking data is stored and managed by your own Node.js server.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sada-02/Main_Tracker_Firefox.git
cd Main_Tracker_Firefox
```

### 2. Configure Your Server URL

In `background.js`, `content.js`, and `manifest.json`, replace the placeholder:

```js
const TRACKING_SERVER = 'YOUR_TRACKING_SERVER_URL_HERE'; // ← your server URL
```

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Launch the Tracking Server

```bash
node server.js
```

### 5. Load the Extension in Firefox

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on…**
3. Select this repository’s `manifest.json` file.
4. The extension icon will appear in your toolbar upon successful load.

---

## 🛠 Using the Tracker

1. **Compose**: In Gmail or Yahoo Mail, open a new message window.
2. **Enable Tracking**: Click the **Track** button to embed the tracking pixel.
3. **Send**: The pixel is automatically added when you send the email.
4. **Monitor**: Click the extension icon to open the dashboard and see open events.

---

## 📂 Code Overview

* **manifest.json**: Extension metadata and required permissions.
* **content.js**: Injects UI elements and pixel markup into compose windows.
* **background.js**: Polls your server for open events and dispatches notifications.
* **popup.html / popup.js**: Frontend interface for the dashboard.
* **server.js**: Express-based backend to log pixel requests and open events.
* **package.json**: Lists backend dependencies.

---

## 💡 Developer Notes

This extension uses the [WebExtensions API](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions). Ensure your tracking server is running and accessible by the extension. For production environments, update the `TRACKING_SERVER` constant accordingly and review `manifest.json` for any required permission adjustments.
