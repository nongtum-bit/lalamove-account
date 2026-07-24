LalaDaily - Lalamove Daily Tracker
Project Goal
Build a reliable daily financial tracker for Lalamove drivers that can later integrate with deeper financial analysis (bank statements, monthly P&L).
Update History
Current Status (24 Jul 2026) - "LalaDaily Max Pro" Update
￼ UI/UX Overhaul:
￼ Premium Dark UI design with Glassmorphism effects.
￼ Implemented Bottom Sheet modals for forms and details (Mobile-native feel).
￼ Fixed Floating Action Button (FAB) layout and scroll-padding issues.
￼ Advanced Fuel & Vehicle Tracking:
￼ Deep fuel logging: input price per liter, distance, and dashboard KM/L.
￼ Real-time calculation of Actual KM/L vs Dashboard KM/L.
￼ Vehicle maintenance tracker with accumulated distance and threshold alerts (e.g., Oil change).
￼ Analytics & Dashboards:
￼ 7-day net profit bar charts integrated using ⁠Chart.js⁠.
￼ Daily target goal with circular progress ring (Activity ring style).
￼ Clear financial dashboard layout (⁠Net Profit = Income - Fuel - Other Expenses⁠).
￼ Data Management & Flow:
￼ Full History view, grouped by date.
￼ Redesigned transaction interaction: ⁠Tap -> View Details -> Edit or Delete⁠.
￼ Upgraded CSV Export to include all historical data with Thai language support (BOM).
￼ Modules: Fully activated the "Personal" module (separate income/expense tracking).
￼ Tech stack: Vanilla JS + Tailwind + localStorage + Chart.js.
￼ Next priorities: IndexedDB/Firebase Cloud migration, PWA support (Add to Home Screen capability), Monthly P&L reporting.
Previous Status (22 Jul 2026) - MVP Baseline
￼ Architecture: Fully modular (Core + Module separation)
￼ Features implemented:
￼ Live work timer (1-second update)
￼ Income recording with fare + tip + GP deduction
￼ Expense tracking with categories (fuel, food, other)
￼ Daily summary (income, expense, net profit)
￼ Transaction list for today
￼ Export today to CSV
￼ Tech stack: Vanilla JS + Tailwind + localStorage
￼ Next priorities: History view + Charts, IndexedDB migration, PWA support
