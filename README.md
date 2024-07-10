# Google Prompt API

Join the Google Early [Preview Program](https://forms.gle/DWYuEkLYePsFfCZ7A)

Read this for details: https://github.com/explainers-by-googlers/prompt-api

## Overview

This Next.js application demonstrates integration with Chrome's built-in AI capabilities using the experimental Prompt API. It provides a chat interface where users can interact with an AI model directly in their browser.

## Prerequisites

- Node.js (v14 or later)
- Google Chrome (version 127 or later, Canary or Dev channel recommended)
- At least 22 GB of free storage space
- GPU with at least 4 GB VRAM
- Non-metered internet connection

## Chrome Setup

1. Download Chrome Dev or Canary channel
2. Ensure Chrome version is 128.0.6545.0 or newer
3. Set Chrome flags:
   - Navigate to `chrome://flags/#optimization-guide-on-device-model`
   - Set to "Enabled BypassPerfRequirement"
   - Go to `chrome://flags/#prompt-api-for-gemini-nano`
   - Set to "Enabled"
   - Relaunch Chrome

## Verifying Gemini Nano Availability

1. Open Chrome DevTools console
2. Run: `await window.ai.canCreateTextSession();`
   - If it returns "readily", you're set
   - If not, run: `await window.ai.createTextSession();`
3. Relaunch Chrome
4. Go to `chrome://components`
5. Check if Optimization Guide On Device Model is present with version ≥ 2024.5.21.1031
   - If not, click "Check for update"

## Project Setup

1. Clone the repository:
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open `http://localhost:3000` in your Chrome browser

## Key Components

- `AIStatus`: Displays the current status of the AI model
- `ChatInterface`: Manages the chat session and message handling
- `ChatArea`: Renders the chat messages
- `MessageInput`: Handles user input for sending messages

## Styling

This project uses Tailwind CSS for styling. Custom styles can be added in `app/globals.css`.

## Limitations and Notes

- This app uses an experimental API and is for demonstration purposes only
- The Prompt API is intended for local prototyping, not production use
- AI functionality may not work in Incognito or Guest mode
- The app currently only supports English (US) language

## Troubleshooting

If you encounter issues:

- Verify Chrome flags are correctly set
- Ensure Gemini Nano is downloaded (check `chrome://components`)
- Confirm your device meets the hardware requirements
- Try relaunching Chrome or clearing browser data

## Feedback and Contributions

We welcome feedback and contributions. Please open an issue or submit a pull request on our GitHub repository.

## License

MIT

---

This project is part of the Chrome Built-in AI Early Preview Program. For more information, please refer to the [https://forms.gle/DWYuEkLYePsFfCZ7A](official documentation).
