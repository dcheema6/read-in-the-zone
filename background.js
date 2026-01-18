// Background Service Worker - Manifest V3
// Handles context menu, toolbar icon clicks, and message routing

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'rsvp-read-selection',
    title: 'Read Selection',
    contexts: ['selection']
  });
});

// Handle context menu clicks (selected text)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'rsvp-read-selection' && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'START_RSVP',
      text: info.selectionText,
      source: 'selection'
    });
  }
});

// Handle toolbar icon clicks (extract article)
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // First, inject Readability.js if needed
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['lib/Readability.js']
    });

    // Then execute article extraction
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractArticleContent
    });

    if (results && results[0] && results[0].result) {
      const articleText = results[0].result;
      
      // Send extracted text to content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'START_RSVP',
        text: articleText,
        source: 'article'
      });
    } else {
      console.error('No article content found');
    }
  } catch (error) {
    console.error('Error extracting article:', error);
  }
});

// This function runs in the page context to extract article
function extractArticleContent() {
  try {
    // Clone the document to avoid modifying the original
    const documentClone = document.cloneNode(true);
    
    // Use Readability to parse the article
    const reader = new Readability(documentClone);
    const article = reader.parse();
    
    if (article && article.textContent) {
      return article.textContent;
    } else {
      // Fallback to body text if Readability fails
      return document.body.innerText;
    }
  } catch (error) {
    console.error('Readability error:', error);
    // Fallback to body text
    return document.body.innerText;
  }
}
