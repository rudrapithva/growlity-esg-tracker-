# 🧪 Testing & Quality Assurance Summary

**Project**: Growlity ESG Tracker  
**Testing Methodology**: Manual Quality Assurance (QA) & End-to-End Walkthroughs

---

## 🚀 1. Core Testing Areas

### A. Carbon Calculation Engine
*   **Verification**: Manually calculated Scope 1, 2, and 3 emissions for multiple scenarios (e.g., high diesel usage, varying electricity intensity).
*   **Accuracy Check**: Validated that the `calculateEmissions` function correctly applies emission factors (Diesel: 2.68, Petrol: 2.31, etc.) and returns accurate tonnage.
*   **Edge Cases**: Tested with zero/missing values and very high inputs to ensure calculation stability.

### B. Admin Oversight Portal
*   **Role-Based Access**: Verified that only accounts with "Platform ESG Admin" metadata can access the "Shield" icon and administrative routes. 
*   **Multi-Tenant Verification**: Logged in as different users to confirm data silos (Users cannot see each other's history).
*   **Settings Management**: Tested the ability to override global emission factors through the Admin Settings interface.

### C. Reporting & Exporting
*   **PDF Generation**: Verified `jsPDF` and `jspdf-autotable` integration by exporting summaries for all three scopes.
*   **History Logs**: Confirmed that calculation records are correctly saved to `localStorage` and retrieved in the History page.

---

## 🛠 2. Tools & Environments

*   **Browser DevTools**: Used for auditing `localStorage` states and monitoring console errors.
*   **Firebase Emulator/Console**: Monitored Authentication logs and Firestore metadata for role-based testing.
*   **Responsive Testing**: Utilized Chrome's Device Mode to ensure the "Glassmorphism" UI remains stable on mobile and tablet.

---

## 📈 3. Final Verification Steps

1.  **Smoke Test**: Rapidly navigated through Dashboard → Calculator → History → Admin to ensure no 404s or broken links.
2.  **Performance Check**: Audited load times to ensure the high-intensity animations (HSL-based) do not degrade user experience.
3.  **Deployment Audit**: Final check of the production build on Firebase Hosting.
