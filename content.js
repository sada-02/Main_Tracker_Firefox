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
  
  if (composeWindows.length === 0) return;
  
  composeWindows.forEach(window => {
    if (isComposeWindow(window) && !window.dataset.trackerAdded) {
      console.log('Found compose window, adding tracker');
      addTrackingButton(window);
      window.dataset.trackerAdded = 'true';
    }
  });
}

function isComposeWindow(window) {
  if (isGmail) {
    return window.querySelector('input[name="to"]') || 
           window.querySelector('[aria-label*="To"]') ||
           window.querySelector('[data-tooltip="Send"]');
  } else if (isYahoo) {
    // Enhanced Yahoo Mail detection
    const indicators = [
      () => window.querySelector('[data-test-id="to-field"]'),
      () => window.querySelector('input[placeholder*="To"]'),
      () => window.querySelector('[data-test-id="compose-send-button"]'),
      () => window.querySelector('button[aria-label*="Send"]'),
      () => window.querySelector('[aria-label*="To"]'),
      () => window.querySelector('[aria-label*="Subject"]'),
      () => window.querySelector('input[name="to"]'),
      () => window.querySelector('input[name="subject"]'),
      () => window.querySelector('.btn-send'),
      () => window.querySelector('[data-test-id="rte"]')
    ];
    
    return indicators.some(check => {
      try {
        return check();
      } catch (e) {
        return false;
      }
    });
  }
  return false;
}

function addTrackingButton(composeWindow) {
  console.log('🔧 Adding tracking button to compose window...');
  
  const sendButton = findSendButton(composeWindow);
  
  if (!sendButton) {
    console.log('❌ Could not find send button, trying alternative placement');
    tryAlternativeButtonPlacement(composeWindow);
    return;
  }
  
  console.log('✅ Found send button:', sendButton);
  
  const trackButton = document.createElement('button');
  trackButton.textContent = '📊 Track';
  trackButton.type = 'button'; // Prevent form submission
  trackButton.style.cssText = `
    margin-left: 10px;
    padding: 8px 12px;
    background: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    z-index: 9999;
    position: relative;
  `;
  
  let isTracking = false;
  let trackingId = null;
  
  trackButton.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    isTracking = !isTracking;
    
    if (isTracking) {
      trackButton.textContent = '✅ Tracking';
      trackButton.style.background = '#34a853';
      composeWindow.dataset.tracking = 'true';
      
      trackingId = 'track_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      composeWindow.dataset.trackingId = trackingId;
      
      console.log('🎯 Tracking enabled, injecting pixel now...');
      injectTrackingPixel(composeWindow, trackingId);
      
      setupSendTracking(composeWindow);
    } else {
      trackButton.textContent = '📊 Track';
      trackButton.style.background = '#1a73e8';
      composeWindow.dataset.tracking = 'false';
      
      removeTrackingContent(composeWindow);
    }
  };
  
  // Try multiple insertion methods
  try {
    if (sendButton.parentElement) {
      sendButton.parentElement.insertBefore(trackButton, sendButton.nextSibling);
    } else {
      sendButton.insertAdjacentElement('afterend', trackButton);
    }
    console.log('✅ Tracking button added successfully');
  } catch (error) {
    console.log('❌ Error inserting button:', error);
    tryAlternativeButtonPlacement(composeWindow, trackButton);
  }
}

function tryAlternativeButtonPlacement(composeWindow, trackButton = null) {
  console.log('🔄 Trying alternative button placement...');
  
  if (!trackButton) {
    trackButton = document.createElement('button');
    trackButton.textContent = '📊 Track';
    trackButton.type = 'button';
    trackButton.style.cssText = `
      margin: 10px;
      padding: 8px 12px;
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 99999;
    `;
    
    // Add the same click handler
    let isTracking = false;
    let trackingId = null;
    
    trackButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      isTracking = !isTracking;
      
      if (isTracking) {
        trackButton.textContent = '✅ Tracking';
        trackButton.style.background = '#34a853';
        composeWindow.dataset.tracking = 'true';
        
        trackingId = 'track_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        composeWindow.dataset.trackingId = trackingId;
        
        console.log('🎯 Tracking enabled (alternative), injecting pixel now...');
        injectTrackingPixel(composeWindow, trackingId);
        
        setupSendTracking(composeWindow);
      } else {
        trackButton.textContent = '📊 Track';
        trackButton.style.background = '#1a73e8';
        composeWindow.dataset.tracking = 'false';
        
        removeTrackingContent(composeWindow);
      }
    };
  }
  
  // Try to place button in various locations
  const placements = [
    () => composeWindow.appendChild(trackButton),
    () => composeWindow.prepend(trackButton),
    () => document.body.appendChild(trackButton)
  ];
  
  for (let placement of placements) {
    try {
      placement();
      console.log('✅ Alternative button placement successful');
      return;
    } catch (error) {
      continue;
    }
  }
  
  console.log('❌ All button placement methods failed');
}

function findSendButton(composeWindow) {
  if (isGmail) {
    return composeWindow.querySelector('[data-tooltip="Send"]') ||
           composeWindow.querySelector('[aria-label*="Send"]');
  } else if (isYahoo) {
    // Enhanced Yahoo Mail send button detection
    const selectors = [
      '[data-test-id="compose-send-button"]',
      'button[aria-label*="Send"]',
      'button[title*="Send"]',
      '.btn-send',
      '[data-action="send"]',
      'button[type="submit"]',
      '.compose-send-button',
      'button.primary'
    ];
    
    for (let selector of selectors) {
      const button = composeWindow.querySelector(selector);
      if (button) {
        console.log(`Found Yahoo send button with selector: ${selector}`);
        return button;
      }
    }
    
    // Fallback: look for any button containing "Send" text
    const buttons = composeWindow.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent?.toLowerCase().includes('send')) {
        console.log('Found Yahoo send button by text content');
        return button;
      }
    }
  }
  return null;
}

function findEmailBody(composeWindow) {
  if (isGmail) {
    return composeWindow.querySelector('[contenteditable="true"]');
  } else if (isYahoo) {
    // Enhanced Yahoo Mail email body detection
    const selectors = [
      '[data-test-id="rte"]',
      '[contenteditable="true"]',
      '.rte-content',
      '[role="textbox"]',
      '.compose-body',
      'textarea[name="body"]',
      '.message-body',
      '.compose-message'
    ];
    
    for (let selector of selectors) {
      const body = composeWindow.querySelector(selector);
      if (body) {
        console.log(`Found Yahoo email body with selector: ${selector}`);
        return body;
      }
    }
  }
  return null;
}