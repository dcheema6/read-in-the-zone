# Privacy Policy for Read in the Zone - RSVP Reader

**Last Updated: January 18, 2026**

## Overview

Read in the Zone - RSVP Reader ("the Extension") is committed to protecting your privacy. This privacy policy explains how the Extension handles user data and information.

## Data Collection

**We do not collect, store, or transmit any personal data.**

The Extension operates entirely locally within your browser and does not:
- Collect any personal information
- Track your browsing history
- Store any data on external servers
- Transmit any data to third parties
- Use cookies or tracking technologies
- Require user accounts or registration

## Permissions Used

The Extension requests the following permissions to function properly:

### 1. activeTab Permission
- **Purpose**: To access the content of the current webpage when you explicitly activate the Extension
- **Usage**: Allows the Extension to read article text or selected text for RSVP display
- **Data Handling**: Content is processed locally in your browser and is never stored or transmitted

### 2. contextMenus Permission
- **Purpose**: To add a "Read Selection" option to your browser's right-click context menu
- **Usage**: Provides a convenient way to trigger RSVP reading on selected text
- **Data Handling**: No data is collected or transmitted through this feature

### 3. scripting Permission
- **Purpose**: To inject the RSVP overlay interface into webpages when you activate the Extension
- **Usage**: Displays the speed reading interface using Shadow DOM technology
- **Data Handling**: All code execution is local; no user data is collected or transmitted

### Note on Content Scripts
The Extension registers a content script that runs on all websites (`<all_urls>`). This content script:
- Runs in an isolated environment and does not grant host permissions
- Only listens for messages from the Extension
- Does not access or collect any webpage data unless you explicitly activate the Extension
- Works in conjunction with the `activeTab` permission to ensure privacy

## How the Extension Works

1. **Text Selection Mode**: When you select text and choose "Read Selection" from the context menu, the Extension reads the selected text from the DOM and displays it word-by-word in an overlay
2. **Article Mode**: When you click the Extension icon, it uses Readability.js (a Mozilla library) to extract the main article content from the current page and displays it in the RSVP overlay
3. **Local Processing**: All text processing, word timing calculations, and display logic happen entirely within your browser
4. **No Storage**: The Extension does not store any reading history, preferences, or personal data

## Third-Party Libraries

The Extension uses the following third-party library:

- **Readability.js** (by Mozilla): Used to extract main article content from webpages
  - This library runs entirely locally in your browser
  - No data is sent to Mozilla or any external servers
  - Source: https://github.com/mozilla/readability

## Data Security

Since the Extension does not collect, store, or transmit any data, there are no data security concerns related to external storage or transmission. All processing occurs locally within your browser's secure environment.

## Children's Privacy

The Extension does not knowingly collect any information from children or any other users. It is safe for users of all ages as it operates entirely locally without data collection.

## Changes to This Privacy Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this document. Continued use of the Extension after changes constitutes acceptance of the updated privacy policy.

## Your Rights

Since we do not collect any personal data, there is no user data to access, modify, or delete. You maintain complete control over the Extension's functionality:

- You can disable or remove the Extension at any time through Chrome's extension management page (chrome://extensions/)
- The Extension only activates when you explicitly choose to use it
- No background data collection or tracking occurs

## Contact Information

If you have any questions or concerns about this privacy policy or the Extension's data practices, please contact:

**Email**: [Your Contact Email]  
**GitHub**: https://github.com/[your-username]/read-in-the-zone

## Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Other applicable privacy regulations

## Single Purpose Statement

Read in the Zone - RSVP Reader serves a single purpose: to enable speed reading of web content using Rapid Serial Visual Presentation (RSVP) technology. The Extension allows users to select text or extract article content to read it word-by-word at adjustable speeds in an overlay interface.

## Open Source

The Extension's source code is available for review, demonstrating our commitment to transparency and privacy. You can verify that no data collection or transmission occurs by examining the code.

---

**Summary**: Read in the Zone - RSVP Reader is a privacy-focused extension that operates entirely locally in your browser. We do not collect, store, or transmit any personal data. Your reading activity remains completely private.
