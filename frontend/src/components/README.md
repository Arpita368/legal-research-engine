# Frontend component structure

This frontend is organized so each major experience lives in its own component file.

- layout/AppShell.jsx: main shell, navigation, theme toggle, and page routing
- views/AuthExperience.jsx: login/signup/reset/verification experience
- views/DashboardView.jsx: metrics, tasks, recent activity, and judgment feed
- views/LegalSearchView.jsx: search page entry
- views/AIChatView.jsx: assistant interface, prompt suggestions, and source panel
- views/ResearchMemoView.jsx: memo layout and export controls
- views/ProfileView.jsx: account and profile details
- views/SettingsView.jsx: workspace preferences and accessibility options
- views/AdminView.jsx: admin-only controls and dataset health overview
- features/SearchWorkspace.jsx: reusable search experience with filters and result cards
- ui/button.jsx: shared button styling

When making a change, start from the relevant view component and keep business logic separate from styling. Reuse layout and shared UI pieces instead of duplicating markup.
