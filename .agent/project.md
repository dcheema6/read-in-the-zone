# Read in the Zone - RSVP Chrome Extension

## Project Context

A Manifest V3 Chrome Extension for Rapid Serial Visual Presentation (RSVP) speed reading. The extension displays text word-by-word at high speeds in a beautiful Picture-in-Picture overlay with Shadow DOM isolation.

## Quick Facts

- **Type**: Chrome Extension (Manifest V3)
- **Language**: Vanilla JavaScript (no frameworks)
- **Key Library**: Mozilla Readability.js for article extraction
- **UI Pattern**: Shadow DOM for CSS isolation
- **Default WPM**: 300 (adjustable 100-1000)

## Architecture Overview

### Core Components

1. **manifest.json** - Extension configuration
   - Permissions: `contextMenus`, `activeTab`, `scripting`
   - Service worker: `background.js`
   - Content script: `content.js` (runs on all URLs)

2. **background.js** - Service Worker (~2.2KB)
   - Context menu: "Read Selection" for selected text
   - Toolbar icon: Triggers Readability.js article extraction
   - Message router: Sends text to content script

3. **content.js** - Shadow DOM + RSVP Engine (~13KB)
   - Creates isolated Shadow DOM overlay
   - RSVP timer: Recursive setTimeout (not setInterval)
   - ORP highlighting: 35% into each word
   - Controls: Play, pause, reset, WPM slider
   - Draggable overlay
   - Progress tracking

4. **lib/Readability.js** - Mozilla's article parser (~91KB)
   - Extracts clean article content from web pages
   - Removes ads, navigation, clutter

## Key Technical Decisions

### Shadow DOM
- **Why**: Complete CSS isolation from host websites
- **Benefit**: Overlay looks identical on any site (Wikipedia, Medium, Reddit, etc.)
- **Implementation**: `attachShadow({ mode: 'open' })`

### Recursive setTimeout (not setInterval)
- **Why**: Variable timing per word
- **Logic**: Longer words get ~15% more display time
- **Formula**: `baseDelay * (1 + (wordLength - 5) * 0.05)`

### ORP (Optimal Recognition Point)
- **Position**: `Math.floor(word.length * 0.35)`
- **Why**: Eye fixation research shows 35% into word is optimal
- **Visual**: Blue highlight with pulse animation

### Message Passing Interface

```javascript
// Background → Content Script
{
  action: "START_RSVP",
  text: string,
  source: "selection" | "article"
}
```

## File Structure

```
read-in-the-zone/
├── manifest.json          # Manifest V3 config
├── background.js          # Service worker
├── content.js            # Shadow DOM + RSVP engine
├── README.md             # User documentation
├── lib/
│   └── Readability.js    # Article extraction
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── .agent/
    └── project.md        # This file
```

## Design System

### Colors
- **Primary Gradient**: `#6366f1` (indigo) → `#60a5fa` (sky blue)
- **Background**: `rgba(30, 30, 50, 0.98)` with `backdrop-filter: blur(20px)`
- **ORP Highlight**: `#60a5fa` (sky blue)
- **Text**: `#fff` (white) on dark background

### Typography
- **Font**: Inter, -apple-system fallback
- **Word Display**: 48px, 700 weight, -0.02em letter-spacing
- **Controls**: 14-16px

### Animations
- **Slide In**: 0.3s ease-out on overlay appearance
- **ORP Pulse**: 0.3s scale animation on highlighted character
- **Hover Effects**: 0.2s transitions on buttons

## Common Tasks

### Testing the Extension
1. Navigate to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select this directory
5. Test on Wikipedia or Medium

### Debugging
- **Background Script**: Check `chrome://extensions/` → "Inspect views: service worker"
- **Content Script**: Right-click overlay → Inspect (opens Shadow DOM)
- **Console Logs**: Both scripts log errors to respective consoles

### Modifying WPM Range
- Edit `content.js` line ~100: `<input type="range" id="rsvp-wpm" min="100" max="1000" value="300">`

### Changing ORP Position
- Edit `content.js` function `getORP()`: `return Math.floor(word.length * 0.35);`
- Try 0.3 for earlier, 0.4 for later in word

### Updating Styles
- All styles in `content.js` function `getStyles()`
- Shadow DOM scoped, won't affect host page

## Known Limitations

1. **Readability.js Dependency**: Some sites may not parse well (single-page apps, dynamic content)
2. **No Persistence**: WPM preference doesn't save between sessions (could add `chrome.storage.sync`)
3. **No Keyboard Shortcuts**: Currently mouse-only controls (could add spacebar for play/pause)
4. **Single Instance**: Only one overlay at a time (by design)

## Future Enhancement Ideas

- [ ] Save WPM preference to `chrome.storage.sync`
- [ ] Keyboard shortcuts (spacebar = play/pause, arrows = WPM)
- [ ] Word chunking (2-3 words at once for very high speeds)
- [ ] Reading statistics (words read, time spent, average WPM)
- [ ] Dark/light theme toggle
- [ ] Bookmark position in long articles
- [ ] Export reading sessions

## Dependencies

- **Mozilla Readability.js**: Bundled in `lib/` directory
- **No npm packages**: Pure vanilla JavaScript
- **No build step**: Load directly in Chrome

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium)
- ✅ Brave
- ⚠️ Firefox (would need Manifest V2 version)

## Performance

- **Extension Size**: ~93KB total
- **Load Time**: <100ms to inject overlay
- **Memory**: Minimal, service worker auto-sleeps
- **CPU**: Negligible, recursive setTimeout is lightweight

## Troubleshooting

### Extension won't load
- Check manifest.json syntax
- Verify all file paths exist
- Check Chrome console for errors

### Overlay doesn't appear
- Check content script injection in manifest
- Verify permissions granted
- Check browser console for errors

### Readability.js fails
- Fallback to `document.body.innerText` is automatic
- Some sites (SPAs) may not work well
- Try "Read Selection" instead of toolbar icon

### Styles look broken
- Verify Shadow DOM is attached
- Check for console errors
- Inspect Shadow DOM in DevTools

## Quick Reference

### Message Types
- `START_RSVP`: Trigger RSVP with text

### Control IDs (in Shadow DOM)
- `rsvp-play`: Play button
- `rsvp-pause`: Pause button
- `rsvp-reset`: Reset button
- `rsvp-wpm`: WPM slider
- `rsvp-close`: Close button
- `rsvp-word-display`: Word display area
- `rsvp-progress-bar`: Progress bar

### CSS Classes
- `.rsvp-overlay`: Main container
- `.rsvp-header`: Draggable header
- `.rsvp-word-display`: Word display area
- `.rsvp-char`: Individual character
- `.rsvp-char.orp`: ORP highlighted character
- `.rsvp-controls`: Control panel
- `.rsvp-btn`: Button styles

## Development Notes

- **No Build Process**: Direct JavaScript, no transpilation
- **No TypeScript**: Vanilla JS for simplicity
- **No CSS Files**: All styles inline in Shadow DOM
- **No External CDNs**: Everything bundled locally
- **Manifest V3**: Service worker, not persistent background page
