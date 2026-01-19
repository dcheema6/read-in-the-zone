// Content Script - Shadow DOM Injection and Message Handling
// This script runs on all pages and manages the RSVP overlay

let rsvpOverlay = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_RSVP' && message.text) {
    startRSVP(message.text, message.source);
  }
});

function startRSVP(text, source) {
  // Remove existing overlay if present
  if (rsvpOverlay) {
    rsvpOverlay.remove();
  }

  // Create shadow DOM container
  rsvpOverlay = document.createElement('div');
  rsvpOverlay.id = 'rsvp-reader-container';

  // Attach shadow DOM for CSS isolation
  const shadowRoot = rsvpOverlay.attachShadow({ mode: 'open' });

  // Create and inject UI
  createRSVPUI(shadowRoot, text, source);

  // Inject into page
  document.body.appendChild(rsvpOverlay);
}

function createRSVPUI(shadowRoot, text, source) {
  // Create container
  const container = document.createElement('div');
  container.className = 'rsvp-overlay';

  // Create header with drag handle
  const header = document.createElement('div');
  header.className = 'rsvp-header';
  header.innerHTML = `
    <div class="rsvp-title">
      <span class="rsvp-icon">📖</span>
      <span>Read in the Zone</span>
      <span class="rsvp-source">${source === 'selection' ? 'Selection' : 'Article'}</span>
    </div>
    <button class="rsvp-close" id="rsvp-close">✕</button>
  `;

  // Create word display area
  const wordDisplay = document.createElement('div');
  wordDisplay.className = 'rsvp-word-display';
  wordDisplay.id = 'rsvp-word-display';

  // Create controls
  const controls = document.createElement('div');
  controls.className = 'rsvp-controls';
  controls.innerHTML = `
    <button class="rsvp-btn" id="rsvp-play">▶</button>
    <button class="rsvp-btn" id="rsvp-pause" style="display:none;">⏸</button>
    <button class="rsvp-btn" id="rsvp-reset">↻</button>
    <div class="rsvp-wpm-control">
      <label for="rsvp-wpm">
        <span id="rsvp-wpm-value">300</span> WPM
      </label>
      <input type="range" id="rsvp-wpm" min="100" max="1000" value="300" step="50">
    </div>
  `;

  // Create progress bar
  const progress = document.createElement('div');
  progress.className = 'rsvp-progress-container';
  progress.innerHTML = `
    <div class="rsvp-progress-bar" id="rsvp-progress-bar"></div>
    <div class="rsvp-progress-text" id="rsvp-progress-text">0%</div>
  `;

  // Assemble UI
  container.appendChild(header);
  container.appendChild(wordDisplay);
  container.appendChild(controls);
  container.appendChild(progress);

  // Add styles
  const style = document.createElement('style');
  style.textContent = getStyles();

  shadowRoot.appendChild(style);
  shadowRoot.appendChild(container);

  // Initialize RSVP controller
  initializeRSVPController(shadowRoot, text);

  // Make draggable
  makeDraggable(header, container);
}

function getStyles() {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    .rsvp-overlay {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      background: linear-gradient(135deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 40, 0.98));
      backdrop-filter: blur(20px);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 
                  0 0 0 1px rgba(255, 255, 255, 0.1);
      z-index: 2147483647;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -45%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    
    .rsvp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      cursor: move;
      user-select: none;
    }
    
    .rsvp-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
    
    .rsvp-icon {
      font-size: 20px;
    }
    
    .rsvp-source {
      font-size: 12px;
      padding: 4px 10px;
      background: rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #fca5a5;
      font-weight: 500;
    }
    
    .rsvp-close {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      font-size: 20px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .rsvp-close:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: scale(1.1);
    }
    
    .rsvp-word-display {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      font-size: 48px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0;
      position: relative;
    }
    
    .rsvp-word {
      position: relative;
      display: inline-block;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.05s ease-out;
    }
    
    .rsvp-word.positioned {
      opacity: 1;
    }
    
    .rsvp-char {
      display: inline;
    }
    
    .rsvp-char.orp {
      color: #ef4444;
      font-size: 1.15em;
      display: inline;
    }
    
    .rsvp-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .rsvp-btn {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border: none;
      color: #fff;
      font-size: 18px;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    .rsvp-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }
    
    .rsvp-btn:active {
      transform: translateY(0);
    }
    
    .rsvp-wpm-control {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .rsvp-wpm-control label {
      color: #e2e8f0;
      font-size: 14px;
      font-weight: 500;
    }
    
    #rsvp-wpm-value {
      color: #ef4444;
      font-weight: 700;
      font-size: 16px;
    }
    
    #rsvp-wpm {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.1);
      outline: none;
      -webkit-appearance: none;
    }
    
    #rsvp-wpm::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
      transition: all 0.2s;
    }
    
    #rsvp-wpm::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.7);
    }
    
    #rsvp-wpm::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
    }
    
    .rsvp-progress-container {
      position: relative;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0 20px 20px;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .rsvp-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #dc2626, #ef4444);
      width: 0%;
      transition: width 0.2s;
      border-radius: 4px;
    }
    
    .rsvp-progress-text {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #e2e8f0;
      font-size: 11px;
      font-weight: 600;
    }
  `;
}

function initializeRSVPController(shadowRoot, text) {
  // Parse text into words
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);

  let currentIndex = 0;
  let wpm = 300;
  let isPlaying = false;
  let timerId = null;

  const wordDisplay = shadowRoot.getElementById('rsvp-word-display');
  const playBtn = shadowRoot.getElementById('rsvp-play');
  const pauseBtn = shadowRoot.getElementById('rsvp-pause');
  const resetBtn = shadowRoot.getElementById('rsvp-reset');
  const wpmSlider = shadowRoot.getElementById('rsvp-wpm');
  const wpmValue = shadowRoot.getElementById('rsvp-wpm-value');
  const progressBar = shadowRoot.getElementById('rsvp-progress-bar');
  const progressText = shadowRoot.getElementById('rsvp-progress-text');
  const closeBtn = shadowRoot.getElementById('rsvp-close');

  // Calculate delay based on word length and WPM
  function calculateDelay(wordLength) {
    const baseDelay = (60000 / wpm);
    // Longer words get slightly more time
    const lengthFactor = 1 + (wordLength - 5) * 0.05;
    return baseDelay * Math.max(lengthFactor, 0.5);
  }

  // Calculate ORP (Optimal Recognition Point)
  function getORP(word) {
    return Math.floor(word.length * 0.35);
  }

  // Counter for unique word IDs
  let wordCounter = 0;

  // Display word with ORP highlighting - keep ORP at 35% from left
  function displayWord(word) {
    const orpIndex = getORP(word);
    wordCounter++;
    const uniqueId = `rsvp-word-${wordCounter}`;

    // Build word with spans
    const chars = word.split('').map((char, i) => {
      const className = i === orpIndex ? 'rsvp-char orp' : 'rsvp-char';
      return `<span class="${className}">${char}</span>`;
    }).join('');

    // Clear display and set new word
    wordDisplay.innerHTML = `<div class="rsvp-word" id="${uniqueId}">${chars}</div>`;

    // Calculate offset to position the ORP character at 35% from left
    requestAnimationFrame(() => {
      const wordEl = shadowRoot.getElementById(uniqueId);
      if (!wordEl) return;
      
      const orpEl = wordEl.querySelector('.orp');
      if (orpEl) {
        const orpRect = orpEl.getBoundingClientRect();
        const displayRect = wordDisplay.getBoundingClientRect();

        // Calculate how far the ORP is from 35% position
        const targetPosition = displayRect.left + displayRect.width * 0.35;
        const orpCenter = orpRect.left + orpRect.width / 2;
        const offset = targetPosition - orpCenter;

        // Apply transform and show
        wordEl.style.transform = `translateX(${offset}px)`;
        wordEl.classList.add('positioned');
      }
    });
  }

  // Update progress
  function updateProgress() {
    const progress = (currentIndex / words.length) * 100;
    progressBar.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';
  }

  // Main display loop
  function displayNextWord() {
    if (!isPlaying || currentIndex >= words.length) {
      if (currentIndex >= words.length) {
        // Finished
        isPlaying = false;
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        wordDisplay.innerHTML = '<div style="font-size: 24px; color: #60a5fa;">✓ Complete!</div>';
      }
      return;
    }

    const word = words[currentIndex];
    displayWord(word);
    updateProgress();

    currentIndex++;
    const delay = calculateDelay(word.length);
    timerId = setTimeout(displayNextWord, delay);
  }

  // Event handlers
  playBtn.addEventListener('click', () => {
    isPlaying = true;
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    displayNextWord();
  });

  pauseBtn.addEventListener('click', () => {
    isPlaying = false;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    if (timerId) clearTimeout(timerId);
  });

  resetBtn.addEventListener('click', () => {
    isPlaying = false;
    currentIndex = 0;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    if (timerId) clearTimeout(timerId);
    wordDisplay.innerHTML = '<div style="font-size: 20px; color: #94a3b8;">Press ▶ to start</div>';
    updateProgress();
  });

  wpmSlider.addEventListener('input', (e) => {
    wpm = parseInt(e.target.value);
    wpmValue.textContent = wpm;
  });

  closeBtn.addEventListener('click', () => {
    if (timerId) clearTimeout(timerId);
    rsvpOverlay.remove();
    rsvpOverlay = null;
  });

  // Initial display
  wordDisplay.innerHTML = `<div style="font-size: 20px; color: #94a3b8;">Press ▶ to start<br><span style="font-size: 14px; margin-top: 8px; display: block;">${words.length} words ready</span></div>`;
}

function makeDraggable(handle, element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - element.offsetLeft;
    initialY = e.clientY - element.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      element.style.left = currentX + 'px';
      element.style.top = currentY + 'px';
      element.style.transform = 'none';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}
