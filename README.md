# AI Code Mentor

A minimalist, high-performance code analysis tool powered by **Gemini 2.5 Flash** and **Firebase**.
Users can explain, debug, or improve their code with a single click, saving their history for later review.

## Features

*   **AI Analysis**: Uses Google's Gemini 2.5 Flash (and 3.0 Pro for improvements) to analyze code snippets.
*   **Three Modes**: Explain Code, Find Bugs, Improve Code.
*   **History Tracking**: Saves all queries and results to Firestore securely.
*   **Authentication**: Google Sign-In via Firebase Auth.
*   **VibeCoding UI**: Clean, monochromatic, mobile-first design using Tailwind CSS.

## Setup & Configuration

### 1. Firebase Setup
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Authentication** and turn on the **Google** provider.
4.  Enable **Firestore Database** in Test Mode (or set proper rules).
5.  Copy your web app configuration keys.

### 2. Environment Variables
Create a file named `.env` (or set these in your deployment environment).
**Note**: For this React demo, we access `process.env.API_KEY` directly. Ensure your bundler supports this or replace with your hardcoded key for local testing (not recommended for production).

```env
API_KEY=your_gemini_api_key_here
```

### 3. Installation
1.  Replace the `firebaseConfig` object in `services/firebase.ts` with your actual Firebase project keys.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm start
    ```

## Security Note regarding "Cloud Functions"
This project implements the Gemini API call client-side (`services/gemini.ts`) for immediate ease of use and demonstration purposes. In a production environment, you should move the logic inside `services/gemini.ts` to a Firebase Cloud Function (Node.js) to prevent exposing your `API_KEY` to the client browser.

## Technologies
*   React 18 + TypeScript
*   Tailwind CSS
*   Firebase (Auth, Firestore)
*   Google GenAI SDK (`@google/genai`)
