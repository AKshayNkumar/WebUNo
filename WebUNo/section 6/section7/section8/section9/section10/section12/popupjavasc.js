// popup.js

let seniorModeEnabled = false;

// Load current state
chrome.storage.sync.get(['seniorModeEnabled'], (result) => {
  seniorModeEnabled = result.seniorModeEnabled || false;
  updateUI();
});

// Toggle switch
document.getElementById('seniorModeToggle').addEventListener('click', () => {
  seniorModeEnabled = !seniorModeEnabled;
  
  chrome.storage.sync.set({ seniorModeEnabled }, () => {
    updateUI();
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: seniorModeEnabled ? 'ACTIVATE_SENIOR_MODE' : 'DEACTIVATE_SENIOR_MODE'
        });
      }
    });
  });
});

// Quick action buttons
document.getElementById('checkSafety').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.runtime.sendMessage({
        type: 'SCAM_CHECK',
        url: tabs[0].url
      });
    }
  });
  window.close();
});

document.getElementById('readPage').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'READ_PAGE_ALOUD'
      });
    }
  });
  window.close();
});

document.getElementById('getHelp').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.runtime.sendMessage({
        type: 'ALERT_GUARDIAN',
        alertData: {
          url: tabs[0].url,
          pageTitle: tabs[0].title,
          timestamp: new Date().toISOString(),
          reason: 'Help requested via extension'
        }
      });
    }
  });
  
  document.getElementById('statusMessage').textContent = 
    '✅ Your family has been notified!';
  document.getElementById('statusMessage').style.background = '#DCFCE7';
  
  setTimeout(() => window.close(), 2000);
});

document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://app.elderbridge.app/dashboard' });
  window.close();
});

function updateUI() {
  const toggle = document.getElementById('seniorModeToggle');
  const status = document.getElementById('statusMessage');
  
  if (seniorModeEnabled) {
    toggle.classList.add('active');
    status.textContent = '✅ Senior Mode is ON on this page';
    status.style.background = '#DCFCE7';
    status.style.color = '#1A7340';
  } else {
    toggle.classList.remove('active');
    status.textContent = 'Senior Mode is OFF';
    status.style.background = '#F3F4F6';
    status.style.color = '#666666';
  }
}