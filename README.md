# Growlity ESG Tracker

Growlity ESG Tracker is a premium, enterprise-grade platform for measuring, reducing, and sustaining your corporate carbon footprint. It provides real-time Scope 1, 2, and 3 analytics, formal ESG reporting, and platform-wide oversight.

## 🚀 Getting Started

To run the application locally:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Ensure you have your `.env` file configured with the following Firebase keys:
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🔐 Administrator Access

The platform includes a dedicated **Admin Oversight Portal** for multi-tenant monitoring.

- **How to gain Admin Access**:
  - Log in with an email containing "admin" (e.g., `admin@growlity.com`).
  - OR ensure your Firestore user document (collection: `users`, document: `UID`) has a field `role: "Platform ESG Admin"`.
- **Portal Switching**: 
  - Once logged in as an admin, a "Shield" icon labeled **Admin Portal** will appear in the main sidebar.

## 🛠 Features

- **Hub Dashboard**: High-level KPI overview of your carbon intensity.
- **Carbon Calculator**: 4-step wizard for Scope 1, 2, and 3 emissions.
- **Emission History**: Detailed log of past calculations with PDF report exports.
- **Admin Portal**: Platform-wide metrics, enterprise account management, and global emission factor configuration.

## 📁 Project Structure

- `src/pages/`: Core application views.
- `src/pages/admin/`: Dedicated administrative views.
- `src/services/`: Firebase data services (Carbon, Report, Admin).
- `src/contexts/`: Authentication and Role state management.
- `src/index.css`: Premium Design System (HSL tokens, advanced animations).
