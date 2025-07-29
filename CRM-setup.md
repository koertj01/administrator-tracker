Expo CRM App Setup Instructions

Prerequisites





Node.js (v16 or higher)



Expo CLI (npm install -g expo-cli)



A code editor (e.g., VS Code)



An Expo Go app installed on your mobile device (for testing on iOS/Android)



(Optional) PostgreSQL and Prisma setup from previous instructions for backend integration

Setup Steps





Create a New Expo ProjectIf you haven't created an Expo project, run:

expo init crm-app --template blank-typescript
cd crm-app



Install DependenciesCopy the package.json content into your project's package.json and run:

npm install



Set Up Navigation and IconsEnsure all dependencies are installed, including React Navigation and Expo Vector Icons, as listed in package.json. These are required for the drawer navigation and sidebar icons.



Add ScheduleGrid and Test Data





Copy the ScheduleGrid.tsx and ScheduleGrid.types.ts files from previous artifacts (IDs: 5d4d3101-e4d9-4660-9c43-584dfe3b3a6a and de147e52-2aff-49ad-a02e-62e789becd1a) into your project.



Copy the testData.ts file (ID: 0520339d-718b-4c7a-9563-8c9079a259cb) to provide sample data for the Calendar view.



Note: The ScheduleGrid component needs to be adapted for React Native (see notes below).



Replace App Entry PointCopy the App.tsx content into your project's App.tsx file. This sets up the navigation and sidebar menu.



Run the AppStart the Expo development server:

npm start

Use the Expo Go app to scan the QR code for mobile testing, or run npm run web for browser testing.

Notes





Mobile Compatibility: The layout uses useWindowDimensions to adjust the drawer width (70% on mobile, 240px on larger screens). The drawer is permanent on larger screens and collapsible on mobile.



ScheduleGrid Adaptation: The ScheduleGrid component from the previous artifact uses Material-UI, which is not compatible with React Native. You need to replace MUI components (Box, Grid, Typography, etc.) with React Native equivalents (View, Text, etc.) and adjust styles to use StyleSheet. For example:





Replace Box with View



Replace Grid with View and use flexbox for layout



Replace Typography with Text



Convert sx props to style props with StyleSheet.create



Placeholder Views: The Dashboard, Kanban, and Options screens are placeholders. Implement their full functionality as needed.



Icons: The sidebar uses Feather icons from @expo/vector-icons. Ensure the Feather icon set is correctly imported.



Prisma Integration: If using the Prisma backend from the previous artifact (ID: 10cdf68d-2532-4242-8310-adbe61e8de55), set up an API (e.g., using Express) to fetch teamGroups, events, and availabilities data and pass it to the ScheduleGrid component in the CalendarScreen.



Testing: Test on both iOS/Android via Expo Go and on the web to ensure responsive behavior.


Key Features:

    Sidebar Menu: Uses createDrawerNavigator for a left-aligned sidebar with icons, responsive to screen size (collapsible on mobile, fixed on larger screens).
    Routing: Each menu item navigates to a corresponding screen, updating the main content area on the right.
    Mobile Compatibility: Built with Expo and React Native, tested for mobile responsiveness using useWindowDimensions.
    Integration: Reuses the ScheduleGrid component for the Calendar view, with instructions to adapt it for React Native.

Next Steps:

    Adapt the ScheduleGrid component for React Native by replacing MUI components with React Native equivalents.
    Implement full functionality for the Dashboard, Kanban, and Options screens.
    If using a backend, connect to the Prisma/PostgreSQL setup from the previous artifact to fetch real data instead of test data.