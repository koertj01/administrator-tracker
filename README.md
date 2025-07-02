# Administrator-Tracker

A cross-platform task tracking application built with React, Material UI, and Expo.

## Getting Started


### Git Workflow (Windows/Linux)

To contribute changes, use the following commands in your terminal:

```sh
git checkout -b {branchname}
git add .
git commit -m "Message here"
git push
```

Replace `{branchname}` with your desired branch name and `"Message here"` with a descriptive commit message.

---

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for running on web, iOS, or Android)

Install Expo CLI globally if you haven't:
```sh
npm install -g expo-cli
```

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Administrator-Tracker
   ```

2. **Install dependencies:**
   ```sh
   npm install
   npx expo install react-dom react-native-web @expo/metro-runtime
   ```

---

## Running the App

### Expo Web

To run the project in your browser using Expo web:

```sh
npx expo start --web
```

This will open a local development server and launch the app in your default browser.

### Expo Mobile (Optional)

To run on web:

```sh
npx expo start --web
```

Then follow the prompts to open in the Expo Go app (iOS/Android) or an emulator.

---

## Project Structure

- `components/` — React components (including MUI components)
- `assets/` — App icons, splash screens, etc.
- `app.json` — Expo configuration

---

## TODO Notes

- Add setup notes for emulating other devices 
- Refactor the task/tasklist view so that we can share the data with a KanBan card later (this should just be the interfaces and data fetching as separate TX file)

---

## Troubleshooting

- If you encounter issues with MUI or date pickers on web, ensure you are using compatible versions of `@mui/material` and `@mui/x-date-pickers`.
- For best results, use the latest LTS version of Node.js.

---

## Tech Stack

- **React** — Core UI library for building user interfaces
- **Expo** — Framework and platform for universal React applications
- **Material UI (MUI)** — Component library for fast and accessible UI development
- **MUI Icons** — Material Design icons for React
- **MUI X Date Pickers** — Advanced date picker components for MUI
- **Day.js** — Lightweight JavaScript date library for parsing, validating, and formatting dates
- **Emotion** — CSS-in-JS library for styling React components
- **Roboto Font** — Standard font for Material UI

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Material UI Documentation](https://mui.com/)

---

**Happy tracking!**