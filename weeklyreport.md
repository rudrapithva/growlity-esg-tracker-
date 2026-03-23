# Growlity ESG Tracker: 4-Week Development Report

This document contains a structured breakdown of the 4-week development lifecycle of the Growlity ESG Tracker. Use the templates below for your periodic reporting.

---

## 📅 Week 1: Foundation, UI/UX & Authentication
**Goal**: Establish the core design system and secure access management.

*   **Day 1-2**: Project initialization (Vite + React) and Design System setup. Implementing HSL-based color tokens, glassmorphism UI components, and global CSS architecture.
*   **Day 3**: Firebase Authentication integration. Setting up Login/Sign-up flows and securing routes with React Router (v7).
*   **Day 4**: Development of the Main Hub (Dashboard). Implementing high-level KPI cards and layout structure using `lucide-react`.
*   **Day 5**: Authentication Role Management. Implementing logic to distinguish between standard users and "Platform ESG Admins" using Firestore metadata.

---

## 📅 Week 2: Core Carbon Engine & Calculator
**Goal**: Build the logic for carbon footprint measurement.

*   **Day 1**: Emission Factor Architecture. Defining the data structure for Scope 1 (Direct), Scope 2 (Indirect), and Scope 3 (Value Chain) emission factors.
*   **Day 2-3**: Carbon Calculator Phase I. Implementing the 4-step wizard UI with real-time feedback.
*   **Day 4**: Data Persistence Layer. Integrating Firebase Firestore to save calculation logs and user-specific emission history.
*   **Day 5**: Analytics Integration. Visualizing footprint data using `Chart.js` (Pie charts for scope distribution and Line charts for intensity trends).

---

## 📅 Week 3: Admin Portal & Multi-tenant Oversight
**Goal**: Implement comprehensive oversight and administrative controls.

*   **Day 1**: Admin Infrastructure. Setting up dedicated admin routes and the "Shield" icon access logic.
*   **Day 2**: Admin Dashboard. Building the high-level oversight portal for multi-tenant monitoring and global metrics.
*   **Day 3**: Account & Compliance Management. Developing tools for user oversight and audit logs.
*   **Day 4**: Configuration Engine. Building the Admin Settings for global emission factor updates and platform-wide configuration.
*   **Day 5**: Advanced Filtering. Implementing complex query logic for the History page to filter reports by date, scope, and intensity.

---

## 📅 Week 4: Reporting, Optimization & Final Polish
**Goal**: Ensure enterprise-grade reporting and platform stability.

*   **Day 1**: PDF Export Engine. Integrating `jsPDF` and `jspdf-autotable` to generate professional carbon footprint summaries.
*   **Day 2**: Performance Optimization. Implementing code-splitting, image optimization, and refining Vite build configurations.
*   **Day 3**: SEO & Metadata. Standardizing metadata, adding sitemap.xml logic, and ensuring responsive design.
*   **Day 4**: Testing & QA. Comprehensive walkthrough of the Carbon Calculator, Admin Portal, and PDF generation flows.
*   **Day 5**: Final Deployment. Configuring Firebase Hosting and preparing documentation/handover materials.

---

## 📝 Weekly Report Template

| Week | Status | Accomplishments | Challenges |
| :--- | :--- | :--- | :--- |
| **1** | [Completed/Pending] | Environment Setup, Auth, Design System | Color accessibility / HSL tuning |
| **2** | [Completed/Pending] | Carbon Engine, Calculator, Chart.js | Scope 3 intensity calculation logic |
| **3** | [Completed/Pending] | Admin Portal, User Mgmt, Settings | Multi-tenant data privacy |
| **4** | [Completed/Pending] | PDF Reporting, SEO, Final Hosting | Final audit and load times |
