// Complete Multi-platform content script for Gmail and Yahoo Mail
console.log('Mail Tracker: Multi-platform content script loaded');

const TRACKING_SERVER = 'YOUR_TRACKING_SERVER_URL_HERE';

// Detect which email platform we're on
const isGmail = window.location.hostname.includes('mail.google.com');
const isYahoo = window.location.hostname.includes('yahoo.com');

window.addEventListener('load', function() {
  console.log(`Page loaded on ${isGmail ? 'Gmail' : isYahoo ? 'Yahoo' : 'Unknown'}, starting tracker`);
  initTracker();
});

function initTracker() {
  setInterval(checkForCompose, 2000);
}

function checkForCompose() {
  let composeWindows = [];
  
  if (isGmail) {
    composeWindows = document.querySelectorAll('[role="dialog"]');
  } else if (isYahoo) {
    // Enhanced Yahoo Mail compose window detection
    const selectors = [
      '[data-test-id="compose-dialog"]',
      '.compose-container',
      '[aria-label*="Compose"]',
      '.compose-window',
      '[data-test-id="rte-container"]',
      '.D_F', // Yahoo's compose class
      '[role="dialog"]',
      '.compose-popup',
      '.compose-view'
    ];
    
    for (let selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        composeWindows = Array.from(elements);
        console.log(`Found Yahoo compose windows with selector: ${selector}`);
        break;
      }
    }
    
    // Fallback: look for any container with compose elements
    if (composeWindows.length === 0) {
      const allElements = document.querySelectorAll('*');
      for (let element of allElements) {
        if (element.querySelector && 
            (element.querySelector('input[placeholder*="To"]') || 
             element.querySelector('[data-test-id="to-field"]') ||
             element.querySelector('button[aria-label*="Send"]'))) {
          composeWindows = [element];
          console.log('Found Yahoo compose using fallback method');
          break;
        }
      }
    }
  }