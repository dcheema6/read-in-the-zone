# Read in the Zone - RSVP Chrome Extension

A high-performance Chrome Extension for Rapid Serial Visual Presentation (RSVP) speed reading with a beautiful picture-in-picture overlay.

> **Inspired by**: ["How Fast Can You Read? - Speed Reading Challenge"](https://www.youtube.com/watch?v=NdKcDPBQ-Lw)

## Features

✨ **Dual Triggering Modes:**
- **Context Menu**: Right-click on any selected text and choose "Read Selection"
- **Toolbar Icon**: Click the extension icon to automatically extract and read the main article using Readability.js

🎯 **Advanced RSVP Engine:**
- High-precision recursive setTimeout timer for smooth word display
- Adjustable WPM (100-1000 words per minute)
- ORP (Optimal Recognition Point) highlighting for enhanced reading comprehension
- Dynamic word timing based on word length

🎨 **Premium UI:**
- Shadow DOM for complete CSS isolation from host websites
- Glassmorphism design with smooth animations
- Draggable overlay - position it anywhere on the screen
- Real-time progress indicator
- Intuitive play/pause/reset controls

## Installation

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `read-in-the-zone` folder
5. The extension icon should appear in your toolbar!

## Usage

### Method 1: Read Selected Text
1. Select any text on a webpage
2. Right-click and choose "Read Selection"
3. The RSVP overlay will appear with your selected text

### Method 2: Read Full Article
1. Navigate to any article page (works great on Wikipedia, Medium, news sites, etc.)
2. Click the extension icon in your toolbar
3. Readability.js will extract the main content and start RSVP

### Controls
- **▶ Play**: Start the RSVP reading session
- **⏸ Pause**: Pause at current word
- **↻ Reset**: Go back to the beginning
- **WPM Slider**: Adjust reading speed (100-1000 WPM)
- **✕ Close**: Close the overlay
- **Drag**: Click and drag the header to reposition the overlay

## Technical Architecture

### Manifest V3
Built with Chrome's latest extension architecture for enhanced security and performance.

### Shadow DOM
Complete CSS isolation ensures the overlay looks consistent across all websites, preventing style conflicts.

### RSVP Algorithm
- **ORP Calculation**: `Math.floor(word.length * 0.35)` - focuses attention on the optimal character
- **Variable Timing**: Longer words get slightly more display time
- **Recursive setTimeout**: More precise than setInterval for variable-length delays

### Libraries
- **Readability.js**: Mozilla's library for extracting main article content from web pages

## File Structure

```
read-in-the-zone/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (context menu + toolbar logic)
├── content.js            # Shadow DOM injection + RSVP controller
├── lib/
│   └── Readability.js    # Article extraction library
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ⚠️ Other Chromium browsers (may work with minor adjustments)

## Credits

- Inspired by ["How Fast Can You Read? - Speed Reading Challenge"](https://www.youtube.com/watch?v=NdKcDPBQ-Lw)
- Built with Antigravity AI
- Readability.js by Mozilla
- Icon design generated with AI

---

**Happy speed reading! 📖⚡**
