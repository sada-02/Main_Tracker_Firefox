# Mail Tracker – Firefox Extension

A privacy-focused, open-source email tracking add-on for Gmail and Yahoo Mail. Monitor when your messages are opened through a sleek dashboard and receive instant alerts.

## Key Highlights

* **Email Open Tracking:** Injects a lightweight tracking pixel into outgoing emails.
* **Interactive Dashboard:** Browse all tracked messages, view open statuses, and explore usage stats.
* **Instant Alerts:** Real-time notifications notify you when your email is read.
* **Multi-Mail Support:** Compatible with both Gmail and Yahoo Mail.
* **Self-Hosted Backend:** All tracking data is managed by your own Node.js server.

---

## Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/sada-02/Main_Tracker_Firefox.git
cd Main_Tracker_Firefox
```

### 2. Configure Your Server URL

✏️ In `background.js`, `content.js`, and `manifest.json`, replace the placeholder:

```js
const TRACKING_SERVER = 'YOUR_TRACKING_SERVER_URL_HERE'; // ← Replace with your server link
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

1. Navigate to `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on...**
3. Select this repo’s `manifest.json` file.

The extension icon will appear in your toolbar once loaded.

---

## Using the Tracker

1. **Compose:** Open Gmail or Yahoo Mail and start a new message.
2. **Enable Tracking:** Click the **Track** button to activate the tracking pixel.
3. **Send:** The pixel is embedded automatically when you send.
4. **Monitor:** Click the extension icon to view tracking details in the dashboard.

---

## Code Overview

* `manifest.json` – Extension metadata and required permissions.
* `content.js` – UI injection and pixel markup for compose windows.
* `background.js` – Polls the server and dispatches notifications.
* `popup.html` / `popup.js` – Frontend for the tracking dashboard.
* `server.js` – Express server handling pixel requests and open events.
* `package.json` – Lists backend dependencies.

---

## Developer Notes

This extension leverages the [WebExtensions API](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions). Ensure the tracking server is up and reachable from your browser. For production, update the `TRACKING_SERVER` constant and adjust `manifest.json` permissions as needed.
